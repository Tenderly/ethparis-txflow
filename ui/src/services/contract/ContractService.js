class LiveContractService {
}

class MockContractService {
  constructor() {
    this.mock = require('./contracts-mock');
  }

  /**
   * @param {string[]} addresses
   * @returns {Promise<Object[]>}
   */
  getContracts(addresses) {
    return new Promise((resolve => {
      setTimeout(() => {
        return resolve(this.mock);
      }, 1000);
    }));
  }
}

const ContractService = new MockContractService();

export default ContractService;
