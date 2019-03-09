var Calculator = artifacts.require("Calculator");
var fs = require("fs");

module.exports = async () => {
  let instance = await Calculator.deployed();

  let tx;

  tx = await instance.testFunc(0xa, 1000, 77, true, "0x20a5814b73Ef3537c6E099a0d45C798F4BD6e1D6");
  console.log(`testFunc(0xa, 1000, 77, true, "0x20a5814b73Ef3537c6E099a0d45C798F4BD6e1D6") => ${tx.tx}`);

  tx = await instance.add(0x5);
  console.log(`add(0x5) => ${tx.tx}`);
  tx = await instance.mul(0xa);
  console.log(`mul(0xa) => ${tx.tx}`);

  fs.writeFileSync("config.json", JSON.stringify({
    address: instance.address,

    from: tx.receipt.from,
    tx: tx.tx,
  }));
};

