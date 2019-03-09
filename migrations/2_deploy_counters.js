var Counters = artifacts.require("./Counters.sol");

module.exports = function(deployer) {
  deployer.deploy(Counters);
};
