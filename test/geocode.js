const { describe } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiThings);

describe('/GET geocode/reverse-geocoding', () => {
  it('Should return error when lat and lon are not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/reverse-geocoding')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/reverse-geocoding?lon=106.660172')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lon is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/reverse-geocoding?lat=10.762622')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return error when lat and lon are not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/reverse-geocoding?lat=100&lon=200')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return success when lat and long are all valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/reverse-geocoding?lat=10.762622&lon=106.660172')
      .end((err, res) => {
        res.should.have.status(200);

        res.body.should.have.property('name');
        res.body.should.have.property('country');
        res.body.should.have.property('country_code');
        res.body.should.have.property('province');
        res.body.should.have.property('district');
        res.body.should.have.property('ward');
        res.body.should.have.property('lat');
        res.body.should.have.property('lon');

        done();
      });
  });
});

describe('/GET geocode/related-location', () => {
  it('Should return error when text is not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/related-location')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');

        done();
      });
  });

  it('Should return success when a valid location is provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/geocode/related-location?text=Ha Noi')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.all.have.property('name');
        res.body.should.all.have.property('country');
        res.body.should.all.have.property('country_code');
        res.body.should.all.have.property('province');
        res.body.should.all.have.property('district');
        res.body.should.all.have.property('ward');
        res.body.should.all.have.property('lat');
        res.body.should.all.have.property('lon');

        done();
      });
  });
});
