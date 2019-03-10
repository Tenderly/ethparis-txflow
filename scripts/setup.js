var Controller = artifacts.require("Controller");
var fs = require("fs");

module.exports = async () => {
  let instance = await Controller.deployed();

  let tx = await instance.start();
  console.log(`start() => ${tx.tx}`);

  fs.writeFileSync("config.json", JSON.stringify({
    address: instance.address,

    from: tx.receipt.from,
    tx: tx.tx,
  }));
};

