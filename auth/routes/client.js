const path = require('path') // has path and __dirname
const express = require('express')
const router = express.Router()

router.get('/', (req,res) => res.sendFile(path.join(__dirname, '../public/clientAuthenticate.html')))

router.get('/app', (req,res) => res.sendFile(path.join(__dirname, '../public/clientApp.html')))

module.exports = router
