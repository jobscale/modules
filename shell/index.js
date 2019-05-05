const { spawn, exec } = require('child_process');
const { App } = require('common');

class Shell extends App {
  exec(cmd) {
    const promise = this.promise();
    exec(cmd, (e, stdout) => e ? promise.reject(e) : promise.resolve(stdout));
    return promise.instance;
  }
  spawn(command, params, options) {
    const promise = this.promise();
    const proc = spawn(command, params, Object.assign({ shell: true }, options));
    proc.stdout.on('data', data => promise.resolve(data.toString()));
    return promise.instance;
  }
}
module.exports = {
  Shell,
};
