const express = require('express')
const router = express.Router()
const Entry = require('../models/entry')
const User = require('../models/users')
const checkAuth = require('../middleware/auth')
const checkAuth2 = require('../middleware/auth2')
const entryService = require('../services/entryService')

//  lista svih unosa istog usera
router.get('/users/:userId', checkAuth, checkAuth2, function (req, res, next) {
  const id = req.params.userId
  entryService.getEntriesByUserId(id).then(function (response) {
    return res.status(200).json(response)
  }).catch(error => res.status(400).json(error))
})

router.post('/', checkAuth, checkAuth2, function (req, res, next) {
  entryService.postEntry(req).then(response => {
    res.status(201).json(response)
  }).catch(error => {
    res.status(400).json(error)
  })
})

//  middleware za preostale rute
router.use('/:entryId', checkAuth, function (req, res, next) {
  if (req.params.entryId !== undefined) {
    Entry.findById(req.params.entryId).exec().then(result => {
      return User.findById(result.userId).exec()
    }).then(user => {
      if (req.userData.userId.toString() === user._id.toString() || req.userData.rank > user.rank) {
        next()
      } else {
        return res.status(401).json({message: 'Unauthorised'})
      }
    }).catch(error => {
      console.log(error)
      return res.status(400).json({error: 'Something went wrong'})
    })
  } else {
    return res.status(400).json({message: 'Bad request'})
  }
})

router.get('/:entryId', function (req, res) {
  const id = req.params.entryId
  entryService.getEntryById(id).then(response => { res.status(200).json(response) }).catch(error => res.status(400).json(error))
})

//  stavljanje novog unosa

//  uređivanje unosa
router.patch('/:entryId', function (req, res) {
  const id = req.params.entryId
  entryService.patchEntryById(id, req).then(response => { res.status(200).json(response) }).catch(error => res.status(400).json(error))
})

//  brisanje unosa
router.delete('/:entryId', function (req, res) {
  const id = req.params.entryId
  entryService.deleteEntryById(id).then(response => res.status(200).json(response)).catch(error => res.status(400).json(error))
})

// ako nigdje funkcija ne naiđe na odgovor znači da ne postoji takva metoda
router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
