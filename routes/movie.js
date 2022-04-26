const router = require("express").Router();
const movie = require("../models/movie");
const {verifyToken} = require("../validation");

// CRUD operations

// Create movie - post
//router.post("/", verifyToken, (req, res) => {
router.post("/", (req, res) => {
    data = req.body;

    movie.insertMany(data)
    .then(data => {res.status(201).send(data);})
    .catch(err => {res.status(500).send({message: err.message});})
});

// Read all movies - get
router.get("/", (req, res) => {
    movie.find()
    .then(data => {
        res.send(mapArray(data))
    })
    .catch(err => {res.status(500).send({message: err.message});})
});
//Read specific movie - get
router.get("/:id", (req, res) => {
    movie.findById(req.params.id)
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message});})
});

//get value based on "year" that's greater than x or lesser than x
router.get("/year/:operator/:year", (req, res) => {
    const operator = req.params.operator;
    const year = req.params.year;
    let filter = {};

    if(operator == "gte"){
        filter = {$gte: req.params.year}
    }
    else if(operator == "lte"){
        filter = {$lte: req.params.year}
    }
    else{
        filter = {$lte: req.params.year}
    }

    movie.find({ year: filter })
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message});})
})

// Update specific movie - put
router.put("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    movie.findByIdAndUpdate(id, req.body)
    .then(data => {
        if(!data){
            res.status(404).send({message: "Cannot update movie with id= " + id + ".Maybe movie was not found"})
        }
        else{
            res.send({message: "Movie was updated"})
        }
    })
    .catch(err => {res.status(500).send({message: "Error updating movie with id= " + id});})
});

// Delete specific movie - delete
router.delete("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    movie.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            res.status(404).send({message: "Cannot delete movie with id= " + id + ".Maybe movie was not found"})
        }
        else{
            res.send({message: "Movie was deleted"})
        }
    })
    .catch(err => {res.status(500).send({message: "Error deleting movie with id= " + id});})
});

function mapArray(obj){
    let outputArr = obj.map(element =>({
        id: element._id,
        name: element.name,
        description: element.description,
        year: element.year,
        budget: element.budget,
        //link url
        uri: "/api/movies/" + element._id
     }));
     return outputArr;
}

module.exports = router;