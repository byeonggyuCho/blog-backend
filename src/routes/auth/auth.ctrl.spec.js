const should = require('should');
const request = require('supertest');
const app = require('../../index');

// describe('GET / login check ', () => {
//     it('should return true', (done) => {
//         request(app)
//             .get('/check')
//             .expect(200)
//             .end((err, res) => {
//                 if(err){
//                     throw err
//                 }
//                 done();
//             })
//     })
// })


describe('POST / login', () => {
    it('should return 200 status code', (done) => {
        request(app)
            .post('/login')
            .expect(200)
            .end((err,res) => {

                if(err) throw err;
                done();
            })
 //       (true).should.be.equal(true)
    })
})