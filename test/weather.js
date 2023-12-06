const { describe } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiThings);

describe('/GET weather/current', () => {
  it('Should return error when lat and lon are not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/current')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/current?lon=106.660172')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lon is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/current?lat=10.762622')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat and lon are not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/current?lat=100&lon=200')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return success when lat and long are all valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/current?lat=10.762622&lon=106.660172')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('time');
        res.body.should.have.property('temp_c');
        res.body.should.have.property('temp_f');
        res.body.should.have.property('condition');
        res.body.should.have.property('wind_mph');
        res.body.should.have.property('wind_kph');
        res.body.should.have.property('wind_degree');
        res.body.should.have.property('wind_dir');
        res.body.should.have.property('humidity');
        res.body.should.have.property('precip_in');
        res.body.should.have.property('precip_mm');
        res.body.should.have.property('air_quality');

        done();
      });
  });
});

describe('/GET weather/forecast7d', () => {
  it('Should return error when lat and lon are not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast7d')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast7d?lon=106.660172')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lon is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast7d?lat=10.762622')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat and lon are not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast7d?lat=100&lon=200')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return success when lat and long are all valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast7d?lat=10.762622&lon=106.660172')
      .end((err, res) => {
        res.should.have.status(200);
        //res.body.should.have.length(7);
        res.body.should.all.have.property('time');
        res.body.should.all.have.property('temp_c');
        res.body.should.all.have.property('temp_f');
        res.body.should.all.have.property('condition');
        res.body.should.all.have.property('wind_mph');
        res.body.should.all.have.property('wind_kph');
        res.body.should.all.have.property('humidity');
        res.body.should.all.have.property('precip_in');
        res.body.should.all.have.property('precip_mm');
        res.body.should.all.have.property('air_quality');

        done();
      });
  }).timeout(5000);
});

describe('/GET weather/forecast24h', () => {
  it('Should return error when lat and lon are not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast24h')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast24h?lon=106.660172')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lon is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast24h?lat=10.762622')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat and lon are not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast24h?lat=100&lon=200')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return success when lat and long are all valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/weather/forecast24h?lat=10.762622&lon=106.660172')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.all.have.property('time');
        res.body.should.all.have.property('temp_c');
        res.body.should.all.have.property('temp_f');
        res.body.should.all.have.property('condition');
        res.body.should.all.have.property('wind_mph');
        res.body.should.all.have.property('wind_kph');
        res.body.should.all.have.property('humidity');
        res.body.should.all.have.property('precip_in');
        res.body.should.all.have.property('precip_mm');
        res.body.should.all.have.property('air_quality');

        done();
      });
  }).timeout(5000);
});
