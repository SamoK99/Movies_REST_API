const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('/First Test Collection', () =>{
    it('test default API welcome route...', (done)=>{
        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the MEN RESTful API');
            done();
        })
    })

    it('should POST a valid movie', (done)=>{
        let movie = {
            name: "The Batman",
            description: "Batsy",
            year: "2022",
            budget: "185000000"
        }

        chai.request(server)
        .post('/api/movies')
        .send(movie)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        })
    })

    it('verify we have 1 movie in DB...', (done)=>{
        chai.request(server)
        .get('/api/movies')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
        })
    })


    /* it('should test two values...', () =>{
        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);

    }) */
})