const express = require("express");
const cors = require("cors");
const weatherRoute = require("./routes/weatherRoute");
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/weather", weatherRoute)


module.exports = app;