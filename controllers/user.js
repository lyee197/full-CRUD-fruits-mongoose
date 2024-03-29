/////////////////////////////////////////
// Import Dependencies
/////////////////////////////////////////
const express = require('express')
// ../models/fruits goes back a folder
const User = require('../models/user')
// const FruitRouter = require('./cont')
const bcrypt = require('bcryptjs')

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// two sign up routes
// get to render the sighnup form
router.get('/signup', (req, res) => {
    res.render('users/signup')
})
// post to send the signup info
router.post('/signup', async (req, res) => {
    console.log('this is initial req.body in signup', req.body)
    // first encrypt our password
    req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt(10)
        )
    console.log('req')
    // create a new user
    User.create(req.body)
    // if created successfully redirect to login
        .then(user => {
            res.redirect('/user/login')
        })
    // if an error occurs, send err
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// two login routes
// get to render the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})
// post to send the login info(and create a session)
router.post('/login', async (req, res) => {
    console.log('request object')
    // get the data from the request body
    const { username, password } = req.body
    // then we search for the user
    User.findOne({ username })
        .then(async (user) => {
            // check if the user exists
            if (user) {
                // compare the password
                // bncrypt.compare evaluates to a truthy or a falsy value
                const result = await bcrypt.compare(password, user.password)
                if (result) {
                    //then we'll need to use the session object
                    // store some properties in the session
                    req.session.username = username
                    req.session.loggedIn = true
                    // redirect to /fruits if login is successful
                    res.redirect('/fruits')
                } else {
                    // send an error if the password doesn't match
                    res.json({ error: 'username or password incorrect'})
                }
                // send an error if the user doesn't exist
            } else {
                // 
                res.json({error: 'user does not exist'})
            }     
        })
        // catch any other errors that occur
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})
// signout route -> destroy the session

/////////////////////////////////////////
// Export the Router
/////////////////////////////////////////
module.exports = router