const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require("../validation");
const jwt = require('jsonwebtoken');
const user = require("../models/user");

//registration
router.post("/register", async(req, res) => {
    //validate the user input (name, email, password)
    const {error} = registerValidation(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message});
    }
    //check if the email is already regitered
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist){
        return res.status(400).json({error: "Email already exists"});
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create a user object and save it in the DB
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password
    })

    try{
        const savedUser = await userObject.save();
        res.json({error: null, data: savedUser._id});
    }catch(error){
        res.status(400).json({error})
    }


    return res.status(200).json({msg: "Register route..."});
})

//login
router.post("/login", async(req, res) => {
    
    const {error} = loginValidation(req.body);
    if(error){
        return res.status(400).json({error: error.details[0].message});
    }

    //if login is valid, find the user
    const user = await User.findOne({email: req.body.email});
    if (!user){
        return res.status(400).json({error: "Email is wrong"});
    }
    // user exists, check for password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword){
        return res.status(400).json({error: "Password is wrong"});
    }
    //create authentication token with username and id
    const token = jwt.sign(
        //payload
        {
            name: user.name,
            id: user._id
        },
        //token_secret
        process.env.TOKEN_SECRET,
        //expiration
        {expiresIn: process.env.JWT_EXPIRES_IN},
    );

    //attach auth token to header
    res.header("auth-token", token).json({
        error: null,
        data: {token}
    });


    return res.status(200).json({msg: "Login route..."});
})

module.exports = router;