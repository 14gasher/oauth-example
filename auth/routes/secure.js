const express = require('express')
const router = express.Router() // Instantiate a new router

router.get('/', (req,res) => {  // Successfully reached if can hit this :)
  console.log('Secure info if needed:', res.locals.oauth.token)
  res.json({success: true})
})

module.exports = router
