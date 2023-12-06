const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET article', () => {
  it('should get a list of articles', (done) => {
    chai
      .request(server)
      .get('/api/v1/article')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });
});

describe('/GET article/find', () => {
  it('should find list of articles with keyword', (done) => {
    chai
      .request(server)
      .get('/api/v1/article/find?keywords=corona')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it('should return 400 for find article with empty keyword', (done) => {
    chai
      .request(server)
      .get('/api/v1/article/find?keywords=')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');
        done();
      });
  });
});
