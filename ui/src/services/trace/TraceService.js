import axios from 'axios';
import ContractService from "../contract/ContractService";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const port = process.env.REACT_APP_API_PORT;

const txCache = {};

class LiveTraceService {
  constructor() {
    this.client = axios.create({
      baseURL: `${baseUrl}:${port}`,
    });
  }

  /**
   * @param {string} txHash
   * @returns {Promise<TraceEntry[]>}
   */
  async getTrace(txHash) {
    txHash = txHash.toLowerCase();
    if (txCache.hasOwnProperty(txHash)) {
      return txCache[txHash];
    }

    const response = await this.client.get('/tx', {
      params: {txHash}
    });

    const data = response.data;

    const frames = [];

    for (const datum of data) {
      const contractData = await ContractService.getContract(datum.contract);
      frames.push({
        contractName: contractData.contractName,
        title: datum.title.trim().replace(/(^\s+)|(\s*{*$)/gm, ''),
        contractAddress: datum.contract.toLowerCase(),
        level: datum.level,
        line: datum.line,
        source: contractData.source,
      });
    }

    txCache[txHash] = frames;

    const timeout = window.location.href.indexOf('normal') !== -1 ? 0 : 2000;

    return new Promise(resolve => {
      setTimeout(() => {
        return resolve(txCache[txHash]);
      }, timeout);
    });
  }
}

/**
 * @typedef {Object} TraceEntry
 * @property {number} level
 * @property {number} instruction
 * @property {string} contract_address
 * @property {string} arg_data
 */

class MockTraceService {
  /**
   * @param {string} txHash
   * @returns {Promise<TraceEntry[]>}
   */
  async getTrace(txHash) {
    return new Promise((resolve => {
      setTimeout(() => {
        return resolve(require('./mock'));
      }, 1000);
    }));
  }
}

const TraceService = new LiveTraceService();

export default TraceService;