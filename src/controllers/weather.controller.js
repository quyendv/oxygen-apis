// const apis = require("../src/helpers/apis");
import factory from './weather.factory.js';

const current = factory('current.json', { aqi: 'yes' });
const forecast24h = factory('forecast.json', { aqi: 'yes', days: '1', alerts: 'yes' });
const forecast7d = factory('forecast.json', { aqi: 'yes', days: '7', alerts: 'yes' });
const forecast10d = factory('forecast.json', { aqi: 'yes', days: '10', alerts: 'yes' });
export default { current, forecast24h, forecast7d, forecast10d };
