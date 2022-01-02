const session = require('express-session')
const { model } = require('mongoose')
const MongoDBSession = require('connect-mongodb-session')(session)

const Store = new MongoDBSession({
    uri: process.env.MONGODB_URL,
    collection: 'sessions'
})

module.exports = Store;