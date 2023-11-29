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
  const finalResult = {
    name: result.features[0].properties.name ?? '',
    country: result.features[0].properties.country ?? '',
    country_code: result.features[0].properties.country_code ?? '',
    province: result.features[0].properties.state
      ? result.features[0].properties.state
      : result.features[0].properties.city
      ? result.features[0].properties.city
      : '',
    district: result.features[0].properties.district
      ? result.features[0].properties.district
      : result.features[0].properties.county
      ? result.features[0].properties.county
      : '',
    ward: result.features[0].properties.quarter
      ? result.features[0].properties.quarter
      : result.features[0].properties.suburb
      ? result.features[0].properties.suburb
      : '',

    lat: result.features[0].properties.lat,
    lon: result.features[0].properties.lon,
  };
  finalResult[finalResult.result_type] = finalResult['result_type'];
  return res.status(200).json(result);
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
    return {
      name: el.properties.name ?? '',
      country: el.properties.country ?? '',
      country_code: el.properties.country_code ?? '',
      province: el.properties.state
        ? el.properties.state
        : el.properties.city
        ? el.properties.city
        : '',
      district: el.properties.district
        ? el.properties.district
        : el.properties.county
        ? el.properties.county
        : '',
      ward: result.features[0].properties.quarter
        ? result.features[0].properties.quarter
        : result.features[0].properties.suburb
        ? result.features[0].properties.suburb
        : '',
      lat: el.properties.lat,
      lon: el.properties.lon,
    };
  });
  finalResult[finalResult.result_type] = finalResult['result_type'];
  return res.status(200).json(finalResult);
}
export default { reverseGeocode, getRelatedLocation };
