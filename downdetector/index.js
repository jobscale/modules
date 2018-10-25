const _ = require('lodash');
const { App } = require('common');
const { JSDOM } = require('jsdom');

class DownDetector extends App {
  run() {
    const url = 'https://downdetector.jp/top10';
    return this.fetch(url)
    .then(res => res.text())
    .then(body => new JSDOM(body).window.document)
    .then(document => {
      const el = document.querySelector('table');
      const list = _.values(document.querySelectorAll('table td:nth-child(5) a'));
      return {
        body: el.innerHTML,
        caption: list.map(cel => cel.textContent.trim()).join(', '),
        image: el.querySelector('img').src,
      };
    });
  }
}
module.exports = {
  DownDetector,
};
