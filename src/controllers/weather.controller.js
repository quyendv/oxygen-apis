// const apis = require("../src/helpers/apis");
import factory from './weather.factory.js';
import apis from '../helpers/apis.js';
import cheerio from 'cheerio';
const current = factory('current.json', { aqi: 'yes' });
const forecast24h = factory('forecast.json', { aqi: 'yes', days: '1', alerts: 'yes' });
const forecast7d = factory('forecast.json', { aqi: 'yes', days: '7', alerts: 'yes' });
const forecast10d = factory('forecast.json', { aqi: 'yes', days: '10', alerts: 'yes' });

async function forecast3dAqi(req, res, next) {
  const BASE_URL = process.env.RAPIDAPI_BASE_URL;
  const API_KEY = process.env.RAPID_API_KEY;
  const HOST = process.env.RAPID_API_HOST;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const hours = 72;
  const url = 'forecast/airquality';
  const result = await apis(
    'GET',
    `${BASE_URL}/${url}?lat=${lat}&lon=${lon}&hours=${hours}`,
    null,
    {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': HOST,
    },
  );
  return res.json({
    status: 'success',
    result,
  });
}

async function getAqi(lat, lon) {
  const BASE_URL = process.env.AIR_VISUAL_BASE_URL;
  const API_KEY = process.env.AIR_VISUAL_API_KEY;
  const locationInfo = await apis(
    'GET',
    `${BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`,
  );
  const country = locationInfo.data.country.replaceAll(' ', '-').toLowerCase();
  const state = locationInfo.data.state.replaceAll(' ', '-').toLowerCase();
  const city = locationInfo.data.city.replaceAll(' ', '-').toLowerCase();
  const requestAqiUrl = `https://www.iqair.com/${country}/${state}/${city}`;
  const res = await import('node-fetch').then(({ default: fetch }) => fetch(requestAqiUrl));

  const arr = [];
  if (res.status == 200) {
    const html = await res.text();
    const $ = cheerio.load(html);

    const forecasttable = $('table.aqi-forecast__weekly-forecast-table');

    const body = $(forecasttable).find('tbody');
    $(body)
      .find('tr')
      .each((index, el) => {
        const date = $(el).children().first().text();
        const aqius = $(el).find('.pollutant-level-wrapper').find('b').text();
        arr.push({
          date,
          aqius,
        });
      });
  }
  return arr;
}

async function forecast7dAqi(req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;

  const result = await getAqi(lat, lon);

  return res.json({
    status: 'success',
    result,
  });
}

export default { current, forecast24h, forecast7d, forecast10d, forecast3dAqi, forecast7dAqi };
