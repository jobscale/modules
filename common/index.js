const fetch = require('node-fetch');

class App {
  promise() {
    const promise = {};
    promise.instance = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  }

  get logger() {
    return {
      /* eslint-disable no-console */
      log: console.log,
      info: console.info,
      error: console.error,
      assert: console.assert, /* eslint-enable no-console */
    };
  }

  fetch(url, options) {
    const instanceOptions = Object.assign({}, options);
    if (!instanceOptions.agent && process.env.http_proxy) {
      this.logger.log(process.env.http_proxy);
      const protocol = url.split(':')[0];
      /* eslint-disable global-require, import/no-dynamic-require */
      const Agent = require(`${protocol}-proxy-agent`); /* eslint-enable global-require, import/no-dynamic-require */
      instanceOptions.agent = new Agent(process.env[`${protocol}_proxy`]);
    }
    return fetch(url, instanceOptions);
  }
}
module.exports = {
  App,
};
