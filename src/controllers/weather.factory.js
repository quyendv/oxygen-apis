import apis from '../helpers/apis.js';

const factory = (url, options) =>
  async function (req, res, next) {
    const BASE_URL = process.env.WEATHERAPI_BASE_URL;
    const API_KEY = process.env.WEATHERAPI_API_KEY;
    var optionsStr = '';
    for (const [key, value] of Object.entries(options)) {
      optionsStr += `&${key}=${value}`;
    }

    const lat = req.body.lat;
    const lon = req.body.lon;
    const result = await apis(
      'GET',
      `${BASE_URL}/${url}?q=${lat},${lon}&key=${API_KEY}${optionsStr}`,
    );
    return res.json({
      result,
    });
  };

export default factory;
