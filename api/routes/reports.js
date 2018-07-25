const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/auth')
const checkAuth2 = require('../middleware/auth2')
const reportsService = require('../services/reportsService')

//  lista svih unosa istog usera
router.get('/:userId', checkAuth, checkAuth2, function (req, res) {
  reportsService.getReport(req).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
