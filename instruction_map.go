package main

import "github.com/ethereum/go-ethereum/core/vm"

func InstructionByBytecodePosition(bytecode []byte) map[uint64]uint64 {
	pcToI := make(map[uint64]uint64)

	i := 0
	for pc := 0; pc < len(bytecode); pc++ {
		op := vm.OpCode(bytecode[pc])

		pcToI[uint64(pc)] = uint64(i)

		i++
		if op.IsPush() {
			pc += int(op - vm.PUSH1 + 1)
		}
	}

	return pcToI
}
