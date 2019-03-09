class LiveContractService {
}

class MockContractService {
  /**
   * @param {string[]} addresses
   * @returns {Promise<Object[]>}
   */
  getContracts(addresses) {
    return new Promise((resolve => {
      setTimeout(() => {
        const contracts = require("./contracts-mock");
        return resolve(contracts);
      }, 1000);
    }));
  }
}

const ContractService = new MockContractService();

export default ContractService;
