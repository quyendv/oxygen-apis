function analyzeDisease(req, res, next) {
  let disease = req.query.disease;
  if (!disease || disease == '') {
    return res.status(400).json({
      message: 'Invalid Argument',
    });
  }

  let result = {
    analysis: ['covid', 'aids'],
  };

  return res.status(200).json(result);
}

function shortSuggestion(req, res, next) {
  let aqi = req.query.aqi;
  let co = req.query.co;
  let no2 = req.query.no2;
  let o3 = req.query.o3;
  let so2 = req.query.so2;
  let pm2_5 = req.query.pm2_5;
  let pm10 = req.query.pm10;

  if (!aqi || aqi == '' || isNaN(aqi)) {
    return res.status(400).json({
      message: 'Invalid Argument AQI',
    });
  }

  if (!co || co == '' || isNaN(co)) {
    return res.status(400).json({
      message: 'Invalid Argument CO',
    });
  }

  if (!no2 || no2 == '' || isNaN(no2)) {
    return res.status(400).json({
      message: 'Invalid Argument NO2',
    });
  }

  if (!o3 || o3 == '' || isNaN(o3)) {
    return res.status(400).json({
      message: 'Invalid Argument o3',
    });
  }

  if (!so2 || so2 == '' || isNaN(so2)) {
    return res.status(400).json({
      message: 'Invalid Argument so2',
    });
  }

  if (!pm2_5 || pm2_5 == '' || isNaN(pm2_5)) {
    return res.status(400).json({
      message: 'Invalid Argument pm2_5',
    });
  }

  if (!pm10 || pm10 == '' || isNaN(pm10)) {
    return res.status(400).json({
      message: 'Invalid Argument pm10',
    });
  }

  return res.status(200).json({
    suggestion: `With these disgusting air quality ${aqi}, you should love yourself now`,
  });
}

function longSuggestions(req, res, next) {
  let aqi = req.query.aqi;
  let co = req.query.co;
  let no2 = req.query.no2;
  let o3 = req.query.o3;
  let so2 = req.query.so2;
  let pm2_5 = req.query.pm2_5;
  let pm10 = req.query.pm10;

  if (!aqi || aqi == '' || isNaN(aqi)) {
    return res.status(400).json({
      message: 'Invalid Argument',
    });
  }

  if (!co || co == '' || isNaN(co)) {
    return res.status(400).json({
      message: 'Invalid Argument CO',
    });
  }

  if (!no2 || no2 == '' || isNaN(no2)) {
    return res.status(400).json({
      message: 'Invalid Argument NO2',
    });
  }

  if (!o3 || o3 == '' || isNaN(o3)) {
    return res.status(400).json({
      message: 'Invalid Argument o3',
    });
  }

  if (!so2 || so2 == '' || isNaN(so2)) {
    return res.status(400).json({
      message: 'Invalid Argument so2',
    });
  }

  if (!pm2_5 || pm2_5 == '' || isNaN(pm2_5)) {
    return res.status(400).json({
      message: 'Invalid Argument pm2_5',
    });
  }

  if (!pm10 || pm10 == '' || isNaN(pm10)) {
    return res.status(400).json({
      message: 'Invalid Argument pm10',
    });
  }

  let illnessList = req.query.illness;
  if (!illnessList || illnessList == '') {
    return res.status(400).json({
      message: 'Invalid Argument',
    });
  }

  let suggestionList = illnessList
    .split(',')
    .map((illness) => `Having this disease ${illness}, you should love yourself now`);

  return res.status(200).json({
    suggestions: suggestionList,
  });
}

export default { analyzeDisease, shortSuggestion, longSuggestions };
