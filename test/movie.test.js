const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('/Primary Test Collection', () =>{
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

    it('should register & login a user, POST a movie and verify there is exactly 1', (done)=>{
        let user = {
            name: "Aladar Miazga",
            email: "aladar.miazga@mail.com",
            password: "666420"
        }
        //Register User
        chai.request(server)
        .post('/api/user/register')
        .send(user)
        .end((err, res) =>{
            expect(res.status).to.be.equal(200);   
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal(null);

            //Login User
            chai.request(server)
            .post('/api/user/login')
            .send({
                "email": "aladar.miazga@mail.com",
                "password": "666420"
            })
            .end((err, res) => {                      
                expect(res.status).to.be.equal(200);
                expect(res.body.error).to.be.equal(null);                        
                let token = res.body.data.token;

                //Post Movie to DB
                let movie = {
                    name: "The Batman",
                    description: "Batsy",
                    year: 2022,
                    budget: 185000000
                }
                chai.request(server)
                .post('/api/movies')
                .set({ "auth-token": token })
                .send(movie)
                .end((err, res) =>{
                    expect(res.status).to.be.equal(201);                                
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.eql(1);

                    let savedMovie = res.body[0];
                    expect(savedMovie.name).to.be.equal(movie.name);
                    expect(savedMovie.description).to.be.equal(movie.description);
                    expect(savedMovie.year).to.be.equal(movie.year);
                    expect(savedMovie.budget).to.be.equal(movie.budget);

                    //Verify 1 Movie in DB
                    chai.request(server)
                    .get('/api/movies')
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);                                
                        expect(res.body).to.be.a('array');                                
                        expect(res.body.length).to.be.eql(1);
                
                        done();
                    });
                })
            })
        })

    });

    it('should register & login a user, POST a movie and DELETE it from DB', (done)=>{
        let user = {
            name: "Pista Hufnagel",
            email: "pista.hufnagel@mail.com",
            password: "4206969"
        }
        //Register User
        chai.request(server)
        .post('/api/user/register')
        .send(user)
        .end((err, res) =>{
            expect(res.status).to.be.equal(200);   
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal(null);

            //Login User
            chai.request(server)
            .post('/api/user/login')
            .send({
                "email": "pista.hufnagel@mail.com",
                "password": "4206969"
            })
            .end((err, res) => {                      
                expect(res.status).to.be.equal(200);
                expect(res.body.error).to.be.equal(null);                        
                let token = res.body.data.token;

                //Post Movie to DB
                let movie = {
                    name: "Joker",
                    description: "HAHAHA",
                    year: 2019,
                    budget: 70000000
                }
                chai.request(server)
                .post('/api/movies')
                .set({ "auth-token": token })
                .send(movie)
                .end((err, res) =>{
                    expect(res.status).to.be.equal(201);                                
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.eql(1);

                    let savedMovie = res.body[0];
                    expect(savedMovie.name).to.be.equal(movie.name);
                    expect(savedMovie.description).to.be.equal(movie.description);
                    expect(savedMovie.year).to.be.equal(movie.year);
                    expect(savedMovie.budget).to.be.equal(movie.budget);

                    //Delete movie
                    chai.request(server)
                    .delete('/api/movies/' + savedMovie._id)
                    .set({ "auth-token": token })
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);                                        
                        const actualVal = res.body.message;
                        expect(actualVal).to.be.equal('Movie was deleted');        
                        done();
                    });
                })
            })
        })

    })
    it('should register user with invalid input', (done) => {
        let user = {
            name: "Jeffrey Bezos",
            email: "jeffy@amazon.com",
            password: "123" //Faulty password
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal("\"password\" length must be at least 6 characters long");  
                done();              
            });
    });

  /*   it('verify we have 1 movie in DB...', (done)=>{
        chai.request(server)
        .get('/api/movies')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
        })
    }) */


    /* it('should test two values...', () =>{
        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);

    }) */
})