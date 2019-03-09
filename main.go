package main

import (
	"encoding/json"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/consensus"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethdb"
	"io/ioutil"
	"log"
	"os/exec"
	"time"
)

var db ethdb.Database
var cfg Config

func runKill() {
	cmd := exec.Command("scripts/shutdown.sh")
	err := cmd.Start()
	if err != nil {
		log.Printf("Error while starting shutdown: %s", err)
	}
	err = cmd.Wait()
	if err != nil {
		log.Printf("Error while waiting for shutdown: %s", err)
	}
	time.Sleep(1000 * time.Millisecond)
}

func init() {
	log.SetFlags(0)

	runKill()

	var err error
	db, err = rawdb.NewLevelDBDatabase("datadir/geth/chaindata", 1024, 1024, "")
	if err != nil {
		log.Fatal(err)
	}

	data, err := ioutil.ReadFile("config.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(data, &cfg)
	if err != nil {
		log.Fatal(err)
	}
}

type Config struct {
	Tx   string `json:"tx"`
	From string `json:"from"`
}

type Chain struct {
	Header *types.Header
}

func (c *Chain) Engine() consensus.Engine {
	panic("implement me")
}

func (c *Chain) GetHeader(hash common.Hash, number uint64) *types.Header {
	return rawdb.ReadHeader(db, hash, number)
}

func main() {
	Start()
}
