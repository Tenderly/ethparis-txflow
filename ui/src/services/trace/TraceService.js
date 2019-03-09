class LiveTraceService {
}

class MockTraceService {
  /**
   * @param {string} txHash
   * @returns {Promise<Object[]>}
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