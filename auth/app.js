const express = require('express')

const app = express()
const port = 3030
const bodyParser = require('body-parser')
const oauthServer = require('./oauth/server.js')

const DebugControl = require('./utilities/debug.js')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(DebugControl.log.request())

app.use('/client', require('./routes/client.js')) // Client routes
app.use('/oauth', require('./routes/auth.js')) // routes to access the auth stuff
// Note that the next router uses middleware. That protects all routes within this middleware
app.use('/secure', (req,res,next) => {
  DebugControl.log.flow('Authentication')
  return next()
},oauthServer.authenticate(), require('./routes/secure.js')) // routes to access the protected stuff
app.use('/', (req,res) => res.redirect('/client'))


app.listen(port)
console.log("Oauth Server listening on port ", port)

module.exports = app // For testing
