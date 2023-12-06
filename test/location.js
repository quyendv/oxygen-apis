const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const { bearer } = require('../src/configs/test.config');

chai.use(chaiHttp);

describe('/POST locations/history', () => {
  it('it should add location history', (done) => {
    chai
      .request(server)
      .post('/api/v1/locations/history')
      .set('Authorization', 'Bearer ' + bearer)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        lat: 10.123,
        long: 20.123,
        aqi: 50,
        time: Math.floor(Date.now() / 1000),
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('id');
        res.body.should.have.property('lat');
        res.body.should.have.property('long');
        res.body.should.have.property('aqi');
        res.body.should.have.property('userId');
        res.body.should.have.property('epoch');

        done();
      });
  }).timeout(10000);
});

describe('/GET locations/history/today', () => {
  it('it should retrieve location history today', (done) => {
    chai
      .request(server)
      .get('/api/v1/locations/history/today')
      .set('Authorization', 'Bearer ' + bearer)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.all.have.property('id');
        res.body.should.all.have.property('lat');
        res.body.should.all.have.property('long');
        res.body.should.all.have.property('aqi');
        res.body.should.all.have.property('userId');
        res.body.should.all.have.property('time');

        done();
      });
  });
});

describe('/GET locations/history/7days', () => {
  it('it should retrieve location history last 7 days', (done) => {
    chai
      .request(server)
      .get('/api/v1/locations/history/7days')
      .set('Authorization', 'Bearer ' + bearer)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.all.have.property('time');
        res.body.should.all.have.property('history');

        res.body.forEach((element) => {
          if (element.history) {
            element.history.should.all.have.property('id');
            element.history.should.all.have.property('lat');
            element.history.should.all.have.property('long');
            element.history.should.all.have.property('aqi');
            element.history.should.all.have.property('userId');
          }
        });

        done();
      });
  });
});
