const shell = require('child_process');
const { App } = require('common');

class Shell extends App {
  exec(cmd) {
    const promise = this.promise();
    shell.exec(cmd, (e, stdout) => e ? promise.reject(e) : promise.resolve(stdout));
    return promise.instance;
  }
}
module.exports = {
  Shell,
};
