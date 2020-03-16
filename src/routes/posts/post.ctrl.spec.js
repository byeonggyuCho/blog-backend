const should = require('should');
const request = require('supertest');
const app = require('../../app');


describe('GET / get posts', () => {

    let {ADMIN_PASS : password} = process.env

    const agent = request.agent(app);

    it('1.login', (done) => {

        agent
            .post('/api/auth/login')
            .send({password})
            .expect(200)
            .end((err,res) => {
                if(err) throw err;

                (res.body).should.have.properties('success');
                res.body.success.should.be.equal(true);

                done();
            })
    })

    it('2. get all posts', (done) => {

        agent.get('/api/posts')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if(err){
                    throw err
                }
                // res.body.should.have.properties('logged');
                // res.body.logged.should.be.equal(false);
                done();
            })
    })
    
    it('3. POST post', (done)=> {

        agent.post('/api/posts')
            .send({
                title: 'Example1',
                body: 'Hellow world',
                tags : ['ex1','hellow']
            })
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {

                let result = {...res.body}
                result.should.have.properties('tags')
                result.should.have.properties('title')
                result.should.have.properties('body')
                done();
                
            }).catch(err=>{
                console.error(err)
            })
            // .end((err, res) =>{
            //     if(err) throw err;

            //     done();
            // })
    })


})

