class LiveTraceService {
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

const TraceService = new MockTraceService();

export default TraceService;