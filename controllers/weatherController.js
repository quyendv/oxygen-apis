const apis = require("../helpers/apis");

async function current   (req, res, next) {
    const BASE_URL = process.env.WEATHERAPI_BASE_URL;
    const API_KEY = process.env.WEATHERAPI_API_KEY;
    const lat = req.body.lat;
    const lon= req.body.lon;
    let result = await apis('GET',`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`);
    res.json({
        result,
    })
}

module.exports = {
    current
}