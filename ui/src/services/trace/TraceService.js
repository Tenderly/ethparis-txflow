class LiveTraceService {
}

class MockTraceService {
  constructor() {
    this.mock = require('./mock');
  }

  /**
   * @param {string} txHash
   * @returns {Promise<Object[]>}
   */
  async getTrace(txHash) {
    return new Promise((resolve => {
      setTimeout(() => {
        return resolve(this.mock);
      }, 1000);
    }));
  }
}

const TraceService = new MockTraceService();

export default TraceService;