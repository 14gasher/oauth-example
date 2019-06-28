const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')


const router = express.Router() // Instantiate a new router

router.get('/authorize', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(path.join(__dirname, '../public/form.html'))
})

router.get('/token', (req,res) => {
  console.log('Code Query Param:', req.query.code)
  req.query.client_id = 'test'
  res.sendFile(path.join(__dirname, '../public/form2.html'))
})

router.post('/authorize', (req,res, next) => { // sends us to our redirect with an authorization code in our url
  console.log('\n\n\nStart Authorization Flow\n\n\n')
  return next()
}, oauthServer.authorize({
  authenticateHandler: {
    handle: req => {
      console.log('Authenticate Handler Called')
      console.group()
      console.log('some_other_user_info_stuff:', req.body.some_other_user_info_stuff)
      console.groupEnd()
      return {userId: 1}
    }
  }
}))

router.post('/token', (req,res,next) => {
  console.log('\n\n\nStart Token Flow\n\n\n')
  const code = req.body.code   // Search in db for this code
  req.body.client_id = 'test'
  req.body.client_secret = 'test'

  req.body.grant_type = 'authorization_code'
  next()
},oauthServer.token({
  requireClientAuthentication: { // whether client needs to provide client_secret
    // 'authorization_code': false,
  },
}))  // Sends back token

module.exports = router
