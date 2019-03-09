import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const port = process.env.REACT_APP_API_PORT;

const contractCache = {};

class LiveContractService {
  constructor() {
    this.client = axios.create({
      baseURL: `${baseUrl}:${port}`,
    });
  }

  /**
   * @param {string} address
   * @returns {Promise<Object>}
   */
  async getContract(address) {
    address = address.toLowerCase();
    if (contractCache.hasOwnProperty(address)) {
      return contractCache[address];
    }

    const response = await this.client.get('/contracts');

    for (const contractAddress in response.data) {
      if (!response.data.hasOwnProperty(contractAddress)) {
        continue;
      }

      contractCache[contractAddress.toLowerCase()] = response.data[contractAddress];
    }

    return contractCache[address];
  }
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

const ContractService = new LiveContractService();

export default ContractService;
