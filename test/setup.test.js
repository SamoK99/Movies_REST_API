process.env.NODE_ENV = 'test';

const Movie = require('../models/movie');
const User = require('../models/user');

before((done) => {
    Movie.deleteMany({}, (err) =>{});
    User.deleteMany({}, (err) =>{});
    done();
})
after((done) => {
    Movie.deleteMany({}, (err) =>{});
    User.deleteMany({}, (err) =>{});
    done();
})