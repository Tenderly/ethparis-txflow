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

    const response = await this.client.get('/contract');
    let i = 0;

    for (const contractAddress in response.data) {
      if (!response.data.hasOwnProperty(contractAddress)) {
        continue;
      }

      contractCache[contractAddress.toLowerCase()] = {
        variant: (i++ % 4),
        ...response.data[contractAddress]
      };
    }

    return contractCache[address];
  }
}

const ContractService = new LiveContractService();

export default ContractService;
