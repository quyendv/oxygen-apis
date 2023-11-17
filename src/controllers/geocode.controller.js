import apisCall from '../helpers/apis';

async function reverseGeocode(req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;

  const BASE_URL = process.env.GEOCODE_BASE_URL;
  const API_KEY = process.env.GEOCODE_API_KEY;

  const result = await apisCall(
    'GET',
    `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`,
  );

  return res.status(200).json(result.features[0].properties);
}
async function getRelatedLocation(req, res, next) {
  const text = req.query.text;

  const BASE_URL = process.env.GEOCODE_BASE_URL;
  const API_KEY = process.env.GEOCODE_API_KEY;

  const result = await apisCall(
    'GET',
    encodeURI(`${BASE_URL}/autocomplete?text=${text}&apiKey=${API_KEY}`),
  );

  return res.status(200).json(result.features[0].properties);
}
export default { reverseGeocode, getRelatedLocation };
