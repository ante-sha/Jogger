const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/auth')

const manageService = require('../services/manageService')

//  lista svih unosa istog usera
router.use('/', checkAuth, (req, res, next) => {
  if (req.userData.rank === 3) {
    next()
  } else {
    res.status(401).json({message: 'Unauthorised'})
  }
})

router.get('/entry', function (req, res) {
  manageService.getAllEntries().then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
})

//  uređivanje unosa
router.patch('/promote', function (req, res) {
  if (req.body.newRank >= 1 && req.body.newRank <= 3) {
    manageService.patchPromote(req).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
  } else {
    const error = new Error('Bad request')
    res.status(400).json(error)
  }
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

//  brisanje unosa

module.exports = router
