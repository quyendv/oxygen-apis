import db from '../models';

async function getCities(req, res, next) {
  const cities = await db.City.findAll();

  return res.status(200).json(cities);
}
async function getDistricts(req, res, next) {
  const codename = req.query.codename;
  const city = await db.City.findOne({ codename });
  const districts = await db.District.findAll({
    where: {
      city_code: city.code,
    },
  });

  return res.status(200).json(districts);
}

async function getWards(req, res, next) {
  const codename = req.query.codename;
  const district = await db.District.findOne({ codename });
  const wards = await db.Ward.findAll({
    where: {
      district_code: district.code,
    },
  });

  return res.status(200).json(wards);
}
export default { getCities, getDistricts, getWards };
