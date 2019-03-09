var Calculator = artifacts.require("Calculator");
var fs = require("fs");

module.exports = async () => {
    let instance = await Calculator.deployed();

    let tx;

    tx = await instance.add(5);
    console.log(`add(5) => ${tx.tx}`);
    tx = await instance.mul(20);
    console.log(`mul(20) => ${tx.tx}`);

    fs.writeFileSync("config.json", JSON.stringify({
        address: instance.address,

        from: tx.receipt.from,
        tx: tx.tx,
    }));
};

