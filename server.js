/////////////////////////////////
// import dependencies
/////////////////////////////////
// this allows us to load our env variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const FruitRouter = require('./controllers/fruits')
const UserRouter = require('./controllers/user')
// const Fruit = require('./models/fruit')
// session midleware requirements
const session = require('express-session')
const MongoStore = require('connect-mongo')

const { redirect } = require('express/lib/response')

////////////////////////////////////////////
// Create our express application object
////////////////////////////////////////////
const app = require('liquid-express-views')(express())

////////////////////////////////////////////
// Middleware
////////////////////////////////////////////
// this is for request logging
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
// parses urlencoded request bodies
app.use(express.urlencoded({ extended: false }))
// to serve files from public statically
app.use(express.static('public'))
// this is the middleware to set up a session
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL}),
        saveUninitialized: true,
        resave: false
    })
)

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.use('/fruits', FruitRouter)
app.use('/user', UserRouter)

app.get('/', (req, res) => {
    res.send('your server is running, better go catch it')
})



////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`)
})