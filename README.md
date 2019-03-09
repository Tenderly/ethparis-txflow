# Tx Flow

## How to run
First install all dependencies, and run the front-end:
```bash
go get ./...
cd ui
yarn install
yarn start
```

The next step is to run a geth node in another terminal session:
```bash
make geth
```

After running the geth node, open another terminal window and either deploy your own contracts to the node or use our example:
```bash
make setup
```

Finally you can run the Tx Flow backend:
```bash
go run .
```

If you navigate to [http://localhost:3000](http://localhost:3000) you should see the application running.

Enter the hash of the trasnaction you want to trace and see the call stack instantly.