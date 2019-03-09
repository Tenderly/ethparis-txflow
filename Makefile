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
