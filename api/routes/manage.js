const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/auth')
const checkAuth2 = require('../middleware/auth2')
const manageService = require('../services/manageService')
const mailVerService = require('../services/mailVerService')
const User = require('../models/users')
//  lista svih unosa istog usera
router.use('/', checkAuth, (req, res, next) => {
  if (req.userData.rank === 3) {
    next()
  } else {
    res.status(401).json({message: 'Unauthorised'})
  }
})

router.get('/entry', function (req, res) {
  manageService.getAllEntries().then(result => res.status(200).json(result)).catch(error => res.status(503).json(error))
})

//  uređivanje unosa
router.patch('/promote', checkAuth2, function (req, res) {
  if (req.body.newRank >= 1 && req.body.newRank <= 3 && req.body.userId !== req.userData.userId) {
    manageService.patchPromote(req).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
  } else {
    const error = new Error('Unauthorised')
    res.status(401).json(error)
  }
})

router.post('/verify', function (req, res) {
  User.findById(req.body.userId).exec().then(result => { return mailVerService.sendConfirmationEmail(result.email).then(res.status(200).json({message: 'Email has been send'})) }).catch(err => res.status(400).json(err))
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

//  brisanje unosa

module.exports = router
