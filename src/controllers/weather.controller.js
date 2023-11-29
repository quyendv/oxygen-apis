import apis from '../helpers/apis.js';
import cheerio from 'cheerio';
import validateLatLong from '../utils/validateLocation.js';
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
  let timeOffset = Number(process.env.AQI_TIME_OFFSET) || 7;

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
            timeOffset * 60 * 60;
        } else {
          current.setHours(0, 0, 0, 0);
          epoch = current.getTime() / 1000 + timeOffset * 60 * 60;
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

  if (!validateLatLong(lat, lon)) {
    return res.status(400).json({
      message: 'Invalid Location',
    });
  }
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
      const icon = result.current.condition.icon.split('/').slice(-2);
      const finalResult = {
        time: result.current.last_updated_epoch,
        temp_c: result.current.temp_c,
        temp_f: result.current.temp_f,
        condition: {
          ...result.current.condition,
          icon_type: icon[0],
          icon_code: icon[1].split('.')[0],
          icon: 'https:' + result.current.condition.icon,
        },
        wind_mph: result.current.wind_mph,
        wind_kph: result.current.wind_kph,
        wind_degree: result.current.wind_degree,
        wind_dir: result.current.wind_dir,
        humidity: result.current.humidity,
        precip_in: result.current.precip_in,
        precip_mm: result.current.precip_mm,
        air_quality: {
          co: result.current.air_quality.co,
          no2: result.current.air_quality.no2,
          o3: result.current.air_quality.o3,
          so2: result.current.air_quality.so2,
          pm2_5: result.current.air_quality.pm2_5,
          pm10: result.current.air_quality.pm10,
          aqi,
        },
      };
      return res.status(200).json(finalResult);
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

  if (!validateLatLong(lat, lon)) {
    return res.status(400).json({
      message: 'Invalid Location',
    });
  }
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
      var temp = {
        ...weatherResult[0][i],
        air_quality: aqiResult[i],
      };
      var icon = temp.condition.icon.split('/').slice(-2);

      finalResult.push({
        time: temp.time_epoch,
        temp_c: temp.temp_c,
        temp_f: temp.temp_f,
        condition: {
          ...temp.condition,
          icon_type: icon[0],
          icon_code: icon[1].split('.')[0],
          icon: 'https:' + temp.condition.icon,
        },
        wind_mph: temp.wind_mph,
        wind_kph: temp.wind_kph,
        wind_degree: temp.wind_degree,
        wind_dir: temp.wind_dir,
        humidity: temp.humidity,
        precip_in: temp.precip_in,
        precip_mm: temp.precip_mm,
        chance_of_rain: temp.chance_of_rain,
        air_quality: {
          co: temp.air_quality.co,
          no2: temp.air_quality.no2,
          o3: temp.air_quality.o3,
          so2: temp.air_quality.so2,
          pm2_5: temp.air_quality.pm25,
          pm10: temp.air_quality.pm10,
          aqi: temp.air_quality.aqi,
        },
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

  if (!validateLatLong(lat, lon)) {
    return res.status(400).json({
      message: 'Invalid Location',
    });
  }
  try {
    let result = await apis(
      'GET',
      `${BASE_URL}/${'forecast.json'}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );

    const aqi = await get7dAqi(lat, lon);
    const finalResult = result.forecast.forecastday.map((el, i) => {
      const aqius = aqi[el.date_epoch];
      const icon = el.day.condition.icon.split('/').slice(-2);
      return {
        time: el.date_epoch,
        maxtemp_c: el.day.maxtemp_c,
        maxtemp_f: el.day.maxtemp_f,
        mintemp_c: el.day.mintemp_c,
        mintemp_f: el.day.mintemp_f,
        wind_mph: el.day.maxwind_mph,
        wind_kph: el.day.maxwind_kph,
        temp_c: el.day.avgtemp_c,
        temp_f: el.day.avgtemp_f,
        humidity: el.day.avghumidity,
        condition: {
          ...el.day.condition,
          icon_type: icon[0],
          icon_code: icon[1].split('.')[0],
          icon: 'https:' + el.day.condition.icon,
        },
        wind_degree: el.day.avgwind_degree,
        wind_dir: el.day.avgwind_dir,
        precip_in: el.day.totalprecip_in,
        precip_mm: el.day.totalprecip_mm,
        chance_of_rain: el.day.daily_chance_of_rain,
        air_quality: {
          co: el.day.air_quality?.co,
          no2: el.day.air_quality?.no2,
          o3: el.day.air_quality?.o3,
          so2: el.day.air_quality?.so2,
          pm2_5: el.day.air_quality?.pm2_5,
          pm10: el.day.air_quality?.pm10,
          aqi: aqius,
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
