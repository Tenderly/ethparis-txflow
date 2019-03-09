class LiveContractService {
}

class MockContractService {
  /**
   * @param {string} address
   * @returns {Promise<Object>}
   */
  getContract(address) {
    address = address.toLowerCase();
    return new Promise((resolve => {
      setTimeout(() => {
        const contracts = require("./contracts-mock");

        for (const contract of contracts) {
          for (const networkId in contract.networks) {
            if (contract.networks.hasOwnProperty(networkId) && contract.networks[networkId].address.toLowerCase() === address) {
              return resolve(contract);
            }
          }
        }

        return resolve(undefined);
      }, 1000);
    }));
  }
}

const ContractService = new MockContractService();

export default ContractService;
