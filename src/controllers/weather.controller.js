// const apis = require("../src/helpers/apis");
import factory from './weather.factory.js';
import apis from '../helpers/apis.js';
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
export default { current, forecast24h, forecast7d, forecast10d, forecast3dAqi };
