package main

import (
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/types"
)

func latestBlock() *types.Header {
	hash := rawdb.ReadHeadBlockHash(db)
	number := *(rawdb.ReadHeaderNumber(db, hash))

	return rawdb.ReadHeader(db, hash, number)
}
