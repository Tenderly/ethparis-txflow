package main

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
	"log"
	"math/big"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var InvalidOpcode vm.OpCode = 0xfe

type CallFrame struct {
	Contract    string `json:"contract"`
	Instruction uint64 `json:"instruction"`
	Source      string `json:"title"`
	Line        int    `json:"line"`

	Depth uint64 `json:"level"`
}

type CallStack []*CallFrame

func (s *CallStack) Push(frame *CallFrame) {
	*s = append(*s, frame)
}

func (s *CallStack) Pop() {
	if len(*s) == 0 {
		panic("Ran out of stack")
	}

	*s = (*s)[:len(*s)-1]
}

type Tracer struct {
	LastJump *CallFrame

	Stack CallStack

	contracts map[string]*TruffleContract

	instructionMaps map[string]map[uint64]uint64
	sourceMaps      map[string][]*SourceMapping
	receivers       map[string][]string
	functionDefs    map[string][]*AstNode
}

func NewTracer(contracts map[string]*TruffleContract) *Tracer {
	t := &Tracer{
		contracts: contracts,

		instructionMaps: make(map[string]map[uint64]uint64),
		sourceMaps:      make(map[string][]*SourceMapping),
		receivers:       make(map[string][]string),
		functionDefs:    make(map[string][]*AstNode),
	}

	for addr, contract := range contracts {
		t.sourceMaps[addr] = ParseSourceMap(contract.SourceMap, contract.SourceCode)
		t.receivers[addr] = DiscoverReceivers(contract.Ast)
		t.functionDefs[addr] = DiscoverPrivateFunctionDefinitions(contract.Ast)
	}

	return t
}

func (t *Tracer) CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int) error {
	contract, ok := t.contracts[to.String()]
	if !ok {
		return nil
	}

	fnDefs := DiscoverFunctionDefinitions(contract.Ast)

	target := fmt.Sprintf("%x", input[:4])
	//log.Printf("Start: from %s, to %s, call %t, input 0x%x, gas %d, value %d", from.String(), to.String(), call, input, gas, value)
	for _, fnDef := range fnDefs {
		ref := fnDef.Receiver()
		if ref == target {
			parts := strings.Split(fnDef.Source, ":")
			if len(parts) < 2 {
				panic("No parts")
			}

			start, err := strconv.Atoi(parts[0])
			if err != nil {
				panic(err)
			}
			length, err := strconv.Atoi(parts[1])

			i := 0
			l := 1
			c := 1

			for i < start {
				if contract.SourceCode[i] == '\n' {
					l++
					c = 0
				}

				c++
				i++
			}

			t.Stack.Push(&CallFrame{
				Contract:    to.String(),
				Instruction: 0,
				Source:      strings.Split(contract.SourceCode[start:start+length], "\n")[0],
				Depth:       0,
				Line:        l,
			})
		}
	}

	return nil
}

func (t *Tracer) CaptureState(env *vm.EVM, pc uint64, op vm.OpCode, gas, cost uint64, memory *vm.Memory, stack *vm.Stack, contract *vm.Contract, depth int, err error) error {
	defer func() {
		if op == vm.JUMP || op == vm.JUMPI {
			return
		}

		t.LastJump = nil
	}()
	//log.Printf("PC %d %s // %s\n", pc, op.String(), contract.Address().String())
	switch op {
	case vm.CALL, vm.STATICCALL, vm.DELEGATECALL, vm.CALLCODE:
		//newAddr := common.BigToAddress(stack.Back(1))
		t.Stack.Push(&CallFrame{
			Contract:    contract.Address().String(),
			Instruction: t.toInstruction(contract, pc),
			Depth:       uint64(depth),
			Source:      t.toPreviousSource(contract, pc),
			Line:        t.toLine(t.toPreviousSourceMapping(contract, t.toInstruction(contract, pc))),
		})
	case vm.JUMP:
		//fmt.Printf("PC %d %s // %s\n", pc, op.String(), contract.Address().String())
		//fmt.Printf("JUMP TO: %s\n", common.BigToHash(stack.Back(0)).String())
		t.LastJump = &CallFrame{
			Contract:    contract.Address().String(),
			Instruction: t.toInstruction(contract, pc),
			Depth:       uint64(depth), //@TODO: Fabricate depth
			Source:      t.toSource(contract, pc),
			Line:        t.toLine(t.toSourceMapping(contract, t.toInstruction(contract, pc))),
		}

		return nil
	case vm.JUMPDEST:
		i := t.toInstruction(contract, pc)
		srcMapping := t.toSourceMapping(contract, i)
		if srcMapping == nil {
			return nil
		}

		if t.isFunctionDefinition(contract, srcMapping) && t.LastJump != nil {
			if ok, err := regexp.MatchString(`(?m)function(.*\s)+}`, t.LastJump.Source); ok || err != nil {
				return nil
			}

			t.Stack.Push(t.LastJump)
			//fmt.Printf("JUMPDEST %d %d %d:%d\n", pc, i, srcMapping.Start, srcMapping.Length)
		}
	case vm.RETURN, vm.REVERT, vm.STOP, vm.SELFDESTRUCT, InvalidOpcode:
	}

	return nil
}

func (*Tracer) CaptureFault(env *vm.EVM, pc uint64, op vm.OpCode, gas, cost uint64, memory *vm.Memory, stack *vm.Stack, contract *vm.Contract, depth int, err error) error {
	log.Printf("Fault: PC %d %s // %s", pc, op.String(), contract.Address().String())
	log.Printf("Error depth %d, %s", depth, err)
	return nil
}

func (*Tracer) CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error) error {
	//log.Printf("End: Output %x, Gas Used %d, Time %s, Err %s", output, gasUsed, t, err)
	return nil
}

func (t *Tracer) toInstruction(contract *vm.Contract, pc uint64) uint64 {
	pcToI, ok := t.instructionMaps[contract.Address().String()]
	if !ok {
		pcToI = InstructionByBytecodePosition(contract.Code)

		t.instructionMaps[contract.Address().String()] = pcToI
	}

	i, ok := pcToI[pc]
	if !ok {
		log.Print("Missing toInstruction mapping")
		return 0
	}

	return i
}

func (t *Tracer) toLine(mapping *SourceMapping) int {
	if mapping == nil {
		return 0
	}

	return mapping.Line
}

func (t *Tracer) toSource(contract *vm.Contract, pc uint64) string {
	i := t.toInstruction(contract, pc)

	mapping := t.toSourceMapping(contract, i)

	truffleContract, ok := t.contracts[contract.Address().String()]
	if !ok {
		return "N/A"
	}

	return truffleContract.SourceCode[mapping.Start : mapping.Start+mapping.Length]
}

func (t *Tracer) toPreviousSource(contract *vm.Contract, pc uint64) string {
	i := t.toInstruction(contract, pc)

	mapping := t.toPreviousSourceMapping(contract, i)

	truffleContract, ok := t.contracts[contract.Address().String()]
	if !ok {
		return "N/A"
	}

	return truffleContract.SourceCode[mapping.Start : mapping.Start+mapping.Length]
}

func (t *Tracer) toSourceMapping(contract *vm.Contract, instruction uint64) *SourceMapping {
	srcMap, ok := t.sourceMaps[contract.Address().String()]
	if !ok {
		return nil
	}

	if int(instruction) >= len(srcMap) {
		return nil
	}

	return srcMap[instruction]
}

func (t *Tracer) toPreviousSourceMapping(contract *vm.Contract, instruction uint64) *SourceMapping {
	srcMap, ok := t.sourceMaps[contract.Address().String()]
	if !ok {
		return nil
	}

	if int(instruction) >= len(srcMap) {
		return nil
	}

	next := srcMap[instruction]
	realInstruction := instruction - 1
	for next.Start == srcMap[realInstruction].Start && next.Length == srcMap[realInstruction].Length {
		realInstruction--
	}

	return srcMap[realInstruction]
}

func (t *Tracer) isFunctionDefinition(contract *vm.Contract, mapping *SourceMapping) bool {
	fnDefs, ok := t.functionDefs[contract.Address().String()]
	if !ok {
		return false
	}

	for _, fnDef := range fnDefs {
		parts := strings.Split(fnDef.Source, ":")
		if parts[0] == strconv.Itoa(mapping.Start) {
			return true
		}
	}

	return false
}
