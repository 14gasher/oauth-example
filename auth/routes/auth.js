const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')

const DebugControl = require('../utilities/debug.js')


const router = express.Router() // Instantiate a new router

router.get('/authorize', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(path.join(__dirname, '../public/form.html'))
})

router.get('/token', (req,res) => {
  res.sendFile(path.join(__dirname, '../public/form2.html'))
})

router.post('/authorize', (req,res, next) => { // sends us to our redirect with an authorization code in our url
  DebugControl.log.flow('Authorization')
  return next()
}, oauthServer.authorize({
  authenticateHandler: {
    handle: req => {
      DebugControl.log.functionName('Authenticate Handler')
      DebugControl.log.parameters(Object.keys(req.body).map(k => ({name: k, value: req.body[k]})))
      return {userId: 1}
    }
  }
}))

router.post('/token', (req,res,next) => {
  DebugControl.log.flow('Token')
  next()
},oauthServer.token({
  requireClientAuthentication: { // whether client needs to provide client_secret
    // 'authorization_code': false,
  },
}))  // Sends back token


module.exports = router
