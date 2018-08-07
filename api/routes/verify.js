const express = require('express')
const router = express.Router()
const verifyService = require('../services/verifyService')

router.get('/:token', function (req, res) {
  verifyService.validateUser(req).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
