var Calculator = artifacts.require("Calculator");
var CalculatorStorage = artifacts.require("CalculatorStorage");

module.exports = function (deployer) {
    deployer.deploy(CalculatorStorage).then(function () {
        return deployer.deploy(Calculator, CalculatorStorage.address);
    });
};
