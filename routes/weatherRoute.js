const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
router.get('/current',weatherController.current);



module.exports = router;