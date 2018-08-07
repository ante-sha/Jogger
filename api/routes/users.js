const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/auth')
//  const checkAuth2 = require('../middleware/auth2')
const User = require('../models/users')
const userService = require('../services/userService')

//  lista svih unosa istog usera
router.get('/', checkAuth, function (req, res) {
  userService.getAllVisUsers(req).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
})

//  novi user
router.post('/signup', function (req, res) {
  userService.postSignUp(req).then(result => res.status(201).json(result)).catch(error => res.status(400).json(error))
})

router.post('/login', function (req, res) {
  userService.postLogin(req).then(result => res.status(200).json(result)).catch(error => res.status(401).json({message: error.message}))
})
//  lik stavlja neke returne tu gore
//  brisanje unosa

router.use('/:userId', checkAuth, (req, res, next) => {
  User.findById(req.params.userId).exec().then(result => {
    if (result) {
      if (req.userData.userId === req.params.userId || req.userData.rank > result.rank) {
        res.userData = result
        next()
      } else {
        return res.status(401).json({message: 'Unauthorised'})
      }
    } else {
      return res.status(404).json({message: 'User not found'})
    }
  }).catch(err => {
    console.log(err)
    res.status(400).json({error: err})
  })
})

router.get('/:userId', checkAuth, function (req, res) {
  userService.getOneUser(res).then(result => res.status(200).json(result)).catch(error => res.status(500).json(error))
})
//  brisanje usera i njegovih unosa
router.delete('/:userId', checkAuth, function (req, res) {
  if (req.userData.userId !== req.params.userId) {
    const id = req.params.userId
    userService.deleteUser(id).then(result => res.status(200).json(result)).catch(error => res.status(400).json(error))
  } else {
    res.status(400).json({message: 'Operation not posible'})
  }
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
