const { App } = require('common');
const { Shell } = require('shell');

class SpeedTest extends App {
  constructor() {
    super();
    this.cmd = 'speedtest-cli --simple --share';
  }

  run() {
    return new Shell().exec(this.cmd)
    .then(res => res)
    .catch(e => e.message);
  }
}
module.exports = {
  SpeedTest,
};
