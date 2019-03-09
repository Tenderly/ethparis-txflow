.PHONY: geth reset contracts

geth:
	geth --datadir ./datadir --dev --gcmode archive \
		--rpc --rpcapi 'eth,net,web3,admin,debug,personal,miner,txpool' \
        --ws --wsapi 'eth,net,web3,admin,debug,personal,miner,txpool'
setup:
	truffle migrate --reset
	truffle exec ./scripts/setup.js

reset:
	rm -rf ./datadir

contracts:
	mkdir -p ./build
	rm -rf ./build/*
	solc --combined-json abi,asm,ast,bin,bin-runtime,compact-format,devdoc,hashes,interface,metadata,opcodes,srcmap,srcmap-runtime,userdoc --pretty-json -o ./build/ ./contracts/*
	cp ./build/combined.json ./ui/src/services/contract/contracts-mock.json
