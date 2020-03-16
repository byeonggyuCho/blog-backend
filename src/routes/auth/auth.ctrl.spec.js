const should = require('should');
const request = require('supertest');
const app = require('../../app');


describe('POST / login ', () => {

    let {ADMIN_PASS : password ='11'} = process.env

    const agent = request.agent(app);

    it('first login check, it should be false', (done) => {

        agent
            .post('/api/auth/check')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if(err){
                    throw err
                }
                res.body.should.have.properties('logged');
                res.body.logged.should.be.equal(false);
                done();
            })
    })

    it('is login test with collect password', (done) => {

        agent
            .post('/api/auth/login')
            .send({password})
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if(err){
                    throw err
                }
                (res.body).should.have.properties('success');
                res.body.success.should.be.equal(true);
                done();
            })
    })

})