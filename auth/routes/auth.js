const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')


const router = express.Router() // Instantiate a new router

router.get('/authorize', (req,res) => {  // send back a simple form for the oauth
  // The following fields need to be present:
  // client_id,
  res.sendFile(path.join(__dirname, '../public/form.html'))
})

router.get('/token', (req,res) => {
  console.log('Code Query Param:', req.query.code)
  req.query.client_id = 'test'
  res.sendFile(path.join(__dirname, '../public/form2.html'))
})

router.post('/authorize', (req,res, next) => { // sends us to our redirect with an authorization code in our url
  console.log('\n\n\nStart Authorization Flow\n\n\n')
  Object.assign(req.query, {
    response_type: 'code' // we want a code, not a refresh token
  })
  return next()
}, oauthServer.authorize({
  authenticateHandler: {
    handle: () => {
      console.log('Authenticate Handler Called')
      return {userId: 1}
    }
  }
}))

router.post('/token', (req,res,next) => {
  console.log('\n\n\nStart Token Flow\n\n\n')
  const code = req.body.code
  // Search in db for this code
  req.body.client_id = 'test'
  req.body.client_secret = 'test'

  req.body.grant_type = 'authorization_code'
  next()
},oauthServer.token({
  requireClientAuthentication: {
    // 'authorization_code': false,
  },
}))  // Sends back token

module.exports = router
