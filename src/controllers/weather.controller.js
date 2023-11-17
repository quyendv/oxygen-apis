import apis from '../helpers/apis.js';
import cheerio from 'cheerio';
// const current = factory('current.json', { aqi: 'yes' });
// const forecast24h = factory('forecast.json', { aqi: 'yes', days: '1', alerts: 'yes' });
// const forecast7d = factory('forecast.json', { aqi: 'yes', days: '7', alerts: 'yes' });
// const forecast10d = factory('forecast.json', { aqi: 'yes', days: '10', alerts: 'yes' });

async function forecast3dAqi(req, res, next) {}

async function get7dAqi(lat, lon) {
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

  const arr = {};
  if (res.status == 200) {
    const html = await res.text();
    const $ = cheerio.load(html);

    const forecasttable = $('table.aqi-forecast__weekly-forecast-table');

    const body = $(forecasttable).find('tbody');
    $(body)
      .find('tr')
      .each((index, el) => {
        const date = $(el).children().first().text();

        const current = new Date();
        var epoch;
        if (date != 'Today') {
          epoch =
            new Date(date.split(',')[1].trim() + ' ' + current.getFullYear()).getTime() / 1000 +
            7 * 60 * 60;
        } else {
          current.setHours(0, 0, 0, 0);
          epoch = current.getTime() / 1000 + 7 * 60 * 60;
        }

        const aqius = $(el).find('.pollutant-level-wrapper').find('b').text();
        arr[epoch] = aqius;
      });
  }
  return arr;
}

// async function forecast7dAqi(req, res, next) {
//   const lat = req.query.lat;
//   const lon = req.query.lon;

//   const result = await getAqi(lat, lon);

//   return result
// }

async function current(req, res, next) {
  const BASE_URL = process.env.WEATHERAPI_BASE_URL;
  const API_KEY = process.env.WEATHERAPI_API_KEY;
  const options = { aqi: 'yes' };
  var optionsStr = '';
  for (const [key, value] of Object.entries(options)) {
    optionsStr += `&${key}=${value}`;
  }
  const lat = req.query.lat;
  const lon = req.query.lon;
  try {
    let result = await apis(
      'GET',
      `${BASE_URL}/${'current.json'}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );
    const response = await apis(
      'GET',
      `${process.env.AIR_VISUAL_BASE_URL}/nearest_city?lat=
        ${lat}&lon=${lon}&key=${process.env.AIR_VISUAL_API_KEY}`,
    );
    if (response.status == 'success') {
      const aqi = response.data.current.pollution.aqius;
      return res.status(200).json({
        ...result.current,
        air_quality: {
          ...result.current.air_quality,
          aqius: aqi,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'something went wrong',
    });
  }
}

async function forecast24h(req, res, next) {
  const BASE_URL = process.env.WEATHERAPI_BASE_URL;
  const API_KEY = process.env.WEATHERAPI_API_KEY;
  var options = { aqi: 'no', days: '1', alerts: 'yes' };
  var optionsStr = '';
  for (const [key, value] of Object.entries(options)) {
    optionsStr += `&${key}=${value}`;
  }

  const lat = req.query.lat;
  const lon = req.query.lon;
  try {
    let result = await apis(
      'GET',
      `${BASE_URL}/${'forecast.json'}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );
    const weatherResult = Object.values(result.forecast.forecastday).map((el, i) => {
      return el.hour;
    });
    const aqiResult = await forecast24hAqi(lat, lon);
    const finalResult = [];
    for (var i = 0; i < 24; i++) {
      finalResult.push({
        ...weatherResult[0][i],
        air_quality: aqiResult[i],
      });
    }
    return res.status(200).json(finalResult);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'something went wrong' });
  }
}
async function forecast24hAqi(lat, lon) {
  const BASE_URL = process.env.RAPIDAPI_BASE_URL;
  const API_KEY = process.env.RAPID_API_KEY;
  const HOST = process.env.RAPID_API_HOST;
  const date = new Date();
  const hours = 24 - date.getHours() - 1;
  try {
    const postResult = await apis(
      'GET',
      `${BASE_URL}/${'forecast/airquality'}?lat=${lat}&lon=${lon}&hours=${hours}`,
      null,
      {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST,
      },
    );
    const prevResult = await apis(
      'GET',
      `${BASE_URL}/${'history/airquality'}?lat=${lat}&lon=${lon}`,
      null,
      {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST,
      },
    );
    const finalResult = prevResult.data
      .slice(0, date.getHours() + 1)
      .reverse()
      .concat(postResult.data);

    return finalResult;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function forecast7d(req, res, next) {
  const BASE_URL = process.env.WEATHERAPI_BASE_URL;
  const API_KEY = process.env.WEATHERAPI_API_KEY;
  const options = { days: 7, aqi: 'yes' };
  var optionsStr = '';
  for (const [key, value] of Object.entries(options)) {
    optionsStr += `&${key}=${value}`;
  }
  const lat = req.query.lat;
  const lon = req.query.lon;
  try {
    let result = await apis(
      'GET',
      `${BASE_URL}/${'forecast.json'}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );

    const aqi = await get7dAqi(lat, lon);
    console.log(aqi);
    const finalResult = result.forecast.forecastday.map((el, i) => {
      const aqius = aqi[el.date_epoch];
      return {
        date: el.date,
        date_epoch: el.date_epoch,
        day: {
          ...el.day,
          air_quality: {
            ...el.day.air_quality,
            aqius,
          },
        },
      };
    });
    return res.status(200).json(finalResult);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'something went wrong',
    });
  }
}

export default { current, forecast24h, forecast7d, forecast3dAqi };
