var Bank = artifacts.require("./Bank.sol");
var Store = artifacts.require("./Store.sol");
var Controller = artifacts.require("./Controller.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Bank);

  await deployer.deploy(Store, Bank.address);

  await deployer.deploy(Controller, Store.address);
};
