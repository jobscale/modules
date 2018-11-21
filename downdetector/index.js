const _ = require('lodash');
const { App } = require('common');
const { JSDOM } = require('jsdom');

class DownDetector extends App {
  run() {
    const urls = [{
      location: 'jp',
      url: 'https://downdetector.jp/top10',
    }, {
      location: 'com',
      url: 'https://downdetector.com/top10',
    }];
    return Promise.all(
      urls.map(url => this.parse(url)),
    );
  }
  parse(param) {
    return this.fetch(param.url)
    .then(res => res.text())
    .then(body => new JSDOM(body).window.document)
    .then(document => {
      const el = document.querySelector('table');
      const list = _.values(document.querySelectorAll('table td:nth-child(5) a'));
      list.length = 3;
      return {
        body: el.innerHTML,
        caption: `${param.location} - ${list.map(cel => cel.textContent.trim()).join(', ')}`,
        image: el.querySelector('img').src,
      };
    });
  }
}
module.exports = {
  DownDetector,
};
