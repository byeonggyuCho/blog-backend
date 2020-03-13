const should = require('should');
const request = require('supertest');
const app = require('../../app');



describe('GET / login ', () => {

    let {ADMIN_PASS : password} = process.env

    it('first login check, it should be false', (done) => {

        request(app).post('/api/auth/check')
            .expect(200)
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

        console.log('password preCheck ', password)
        request(app)
            .post('/api/auth/login')
            .send({password: password})
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

    it('is check login state again and should be true', (done) => {
        request(app)
            .post('/api/auth/check')
            .end((err, res) => {
                if(err){
                    throw err
                }

                res.body.should.have.properties('logged');
                res.body.logged.should.be.equal(true);
                done();
            })
    })
})


// describe('POST /login', () => {
//     it('should return 200 status code', (done) => {
//         request(app)
//             .get('/api/auth/login')
//             .expect(200)
//             .end((err,res) => {

//                 if(err) throw err;
//                 done();
//             })
//  //       (true).should.be.equal(true)
//     })
// })