const { describe } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../server');
const should = chai.should();
const { bearer } = require('../src/configs/test.config');

chai.use(chaiHttp);
chai.use(chaiThings);

describe('/GET users', () => {
  it('Should return user info', (done) => {
    chai
      .request(server)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer ' + bearer)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('avatar');
        res.body.should.have.property('diseases');
        res.body.should.have.property('profile');

        res.body.diseases.should.all.have.property('id');
        res.body.diseases.should.all.have.property('name');

        res.body.profile.should.have.property('id');
        res.body.profile.should.have.property('height');
        res.body.profile.should.have.property('weight');
        res.body.profile.should.have.property('sex');
        res.body.profile.should.have.property('dateOfBirth');
        res.body.profile.should.have.property('country');
        res.body.profile.should.have.property('province');
        res.body.profile.should.have.property('district');
        res.body.profile.should.have.property('ward');
        res.body.profile.should.have.property('address');

        done();
      });
  });
});
