var Counters = artifacts.require("./Counters.sol");
var fs = require("fs");

module.exports = async () => {
    let instance = await Counters.deployed();

    let tx;

    tx = await instance.newCounter();
    console.log(`newCounter => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 10);
    console.log(`setCounter(0, 10) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 10);
    console.log(`setCounter(0, 10) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 10);
    console.log(`setCounter(0, 10) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 10);
    console.log(`setCounter(0, 10) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);
    tx = await instance.setCounter(0, 5);
    console.log(`setCounter(0, 5) => ${tx.receipt.blockNumber}`);

    fs.writeFileSync("config.json", JSON.stringify({address: instance.address}))
    console.log(`Address: ${instance.address}`)
};

