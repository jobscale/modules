const weather = require('weather-js');
const { App } = require('common');
const { JSDOM } = require('jsdom');

class Weather extends App {
  run() {
    const url = 'https://tenki.jp/forecast/6/30/6200/27100/';
    return this.fetch(url)
    .then(res => res.text())
    .then(body => new JSDOM(body).window.document)
    .then(document => {
      const el = document.querySelector('.today-weather');
      const today = {
        telop: el.querySelector('.weather-telop').textContent,
        date: el.querySelector('.left-style').textContent,
      };
      const caption = `${today.telop} ${today.date}`;
      return {
        body: el.innerHTML,
        caption,
        image: el.querySelector('img').src,
      };
    });
  }
  find(search) {
    const promise = this.promise();
    weather.find({ search, degreeType: 'C' }, (e, res) => {
      if (e) {
        this.logger.error(e);
        promise.reject(e);
      } else {
        promise.resolve(res);
      }
    });
    return promise.instance;
  }
}
module.exports = {
  Weather,
};
