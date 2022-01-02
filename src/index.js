const express = require('express')
const userRouter = require('./routers/user')
const session = require('express-session')
const Store = require('./db/session');
const bodyParser = require("body-parser");
const ejs = require('ejs');

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: Store,
  }))
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})