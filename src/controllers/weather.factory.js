import apis from '../helpers/apis.js';

const factory = (url, options) =>
  async function (req, res, next) {
    const BASE_URL = process.env.WEATHERAPI_BASE_URL;
    const API_KEY = process.env.WEATHERAPI_API_KEY;
    var optionsStr = '';
    for (const [key, value] of Object.entries(options)) {
      optionsStr += `&${key}=${value}`;
    }

    // const lat = req.body.lat;
    // const lon = req.body.lon;

    const lat = req.query.lat;
    const lon = req.query.lon;
    let result = await apis(
      'GET',
      `${BASE_URL}/${url}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );

    if (url == 'current.json') {
      try {
        const res = await apis(
          'GET',
          `${process.env.AIR_VISUAL_BASE_URL}/nearest_city?lat=
        ${lat}&lon=${lon}&key=${process.env.AIR_VISUAL_API_KEY}`,
        );
        if (res.status == 'success') {
          const aqi = res.data.current.pollution.aqius;
          result = {
            ...result,
            current: {
              ...result.current,
              aqius: aqi,
            },
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    return res.json({
      status: 'success',
      result,
    });
  };

export default factory;
