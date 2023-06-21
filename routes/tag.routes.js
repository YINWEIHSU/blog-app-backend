const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tag.controllers')

router.get('/', tagController.getTags)

module.exports = router
