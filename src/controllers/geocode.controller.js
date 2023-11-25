import apisCall from '../helpers/apis';
import validateLatLong from '../utils/validateLocation';
async function reverseGeocode(req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;
  if (!validateLatLong(lat, lon)) {
    return res.status(400).json({
      message: 'Invalid Location',
    });
  }
  const BASE_URL = process.env.GEOCODE_BASE_URL;
  const API_KEY = process.env.GEOCODE_API_KEY;

  const result = await apisCall(
    'GET',
    `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`,
  );

  return res.status(200).json(result.features[0].properties);
}
async function getRelatedLocation(req, res, next) {
  const text = req.query.text.trim();
  if (text == '') {
    return res.status(400).json({
      message: 'Invalid Argument',
    });
  }
  const BASE_URL = process.env.GEOCODE_BASE_URL;
  const API_KEY = process.env.GEOCODE_API_KEY;

  const result = await apisCall(
    'GET',
    encodeURI(`${BASE_URL}/autocomplete?text=${text}&apiKey=${API_KEY}`),
  );
  const finalResult = result.features.map((el, i) => {
    return el.properties;
  });
  return res.status(200).json(finalResult);
}
export default { reverseGeocode, getRelatedLocation };
