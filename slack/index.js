const FormData = require('form-data');
const _ = require('lodash');
const { App } = require('common');

class Slack extends App {
  constructor(env) {
    super();
    this.env = _.cloneDeep(env);
  }

  send(param) {
    const url = `https://hooks.slack.com/services/${this.env.access}`;
    const body = JSON.stringify(param, null, 2);
    const options = {
      method: 'POST',
      'Content-Type': 'application/json',
      body,
    };
    return this.fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .catch(e => e.message);
  }

  getHistory(count) {
    const url = 'https://slack.com/api/channels.history';
    const param = _.cloneDeep(this.env);
    delete param.access;
    const form = new FormData();
    form.append('token', param.token);
    form.append('channel', param.channel);
    form.append('count', count);
    const options = {
      method: 'POST',
      body: form,
    };
    return this.fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  deleteMessage(message) {
    const url = 'https://slack.com/api/chat.delete';
    const param = _.cloneDeep(this.env);
    delete param.access;
    const form = new FormData();
    form.append('token', param.token);
    form.append('channel', param.channel);
    form.append('ts', message.ts);
    const options = {
      method: 'POST',
      body: form,
    };
    return this.fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch(e => e.message)
    .then(info => this.logger.info(info));
  }

  deleteChat(messages) {
    const promise = this.makePromise();
    const run = (delay) => {
      setTimeout(async () => {
        if (messages && messages.length) {
          await this.deleteMessage(messages.shift());
          this.count++;
        }
        if (!messages || !messages.length) {
          promise.resolve({ success: this.count });
        } else {
          run(messages);
        }
      }, delay);
    };
    const main = () => {
      this.count = 0;
      run(1000);
    };
    main();
    return promise.instance;
  }
}
module.exports = {
  Slack,
};
