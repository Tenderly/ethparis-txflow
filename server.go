package main

import (
	"encoding/json"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"log"
	"net/http"
)

func ServeContracts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	contractsMap, err := Contracts()
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	for addr, c := range contractsMap {
		c.Address = addr
	}

	err = json.NewEncoder(w).Encode(contractsMap)
	if err != nil {
		log.Print(err)
	}
}

func RunTrace(w http.ResponseWriter, r *http.Request) {
	txHash := common.HexToHash(r.URL.Query().Get("txHash"))

	tx, blockHash, blockNumber, _ := rawdb.ReadTransaction(db, txHash)

	var signer types.Signer = types.FrontierSigner{}
	if tx.Protected() {
		signer = types.NewEIP155Signer(tx.ChainId())
	}
	from, _ := types.Sender(signer, tx)

	block := rawdb.ReadBlock(db, blockHash, blockNumber)

	chainCfg := rawdb.ReadChainConfig(db, rawdb.ReadCanonicalHash(db, 0))

	stateDB, err := state.New(block.Root(), state.NewDatabase(db))
	if err != nil {
		log.Printf("failed opening statedb: %s", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	message := types.NewMessage(from, tx.To(), 0, tx.Value(), tx.Gas(),
		tx.GasPrice(), tx.Data(), false)

	author := block.Coinbase()

	vmCtx := core.NewEVMContext(message, block.Header(), &Chain{}, &author)

	contracts, err := Contracts()
	if err != nil {
		log.Printf("failed getting contracts: %s", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	tracer := NewTracer(contracts)
	vmConfig := vm.Config{Debug: true, Tracer: tracer}

	env := vm.NewEVM(vmCtx, stateDB, chainCfg, vmConfig)
	_, _, err = env.Call(vm.AccountRef(from), *tx.To(), tx.Data(), tx.Gas(), tx.Value())
	if err != nil {
		log.Printf("failed calling contract: %s", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(tracer.Stack)
	if err != nil {
		log.Printf("failed sending result: %s", err)
		return
	}
}

func Start() {
	http.HandleFunc("/contract", ServeContracts)
	http.HandleFunc("/tx", RunTrace)

	log.Print("Listening on port 3001...")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
