import httpRequest from 'request-promise';

const callApi = async function (METHOD, URL, BODY = null, HEADERS = null) {
  console.log(URL);
  let headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };
  if (HEADERS && Object.keys(HEADERS).length > 0) {
    headers = { ...headers, ...HEADERS };
  }
  var options = {
    method: METHOD,
    uri: URL,
    headers: headers,
    json: true,
  };
  if (BODY) {
    options.body = BODY;
  }
  let response = await httpRequest(options)
    .then((result) => {
      return result;
    })
    .catch(function (err) {
      console.log(`HELPER API: ${URL} ERROR =`, err.message);
      return err;
    });

  return response;
};

export default callApi;
