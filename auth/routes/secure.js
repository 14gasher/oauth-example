const express = require('express')
const router = express.Router() // Instantiate a new router

router.get('/', (req,res) => {  // Successfully reached if can hit this :)
  res.json({success: true})
})

module.exports = router
