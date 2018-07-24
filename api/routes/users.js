const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/auth')
//  const checkAuth2 = require('../middleware/auth2')
const User = require('../models/users')
const Entry = require('../models/entry')

//  lista svih unosa istog usera
router.get('/', checkAuth, function (req, res) {
  User.find({ $or: [ { _id: req.userData.userId }, { rank: {$lt: req.userData.rank} } ] }).exec().then(doc => {
    if (doc.length >= 1) {
      const response = {
        count: doc.length,
        users: doc.map(a => {
          return {
            _id: a._id,
            email: a.email,
            pass: a.pass,
            //  poslije ce se obrisat
            rank: a.rank,
            request: {
              type1: 'GET, DELETE',
              url1: 'http://localhost:3000/users/' + a._id
              //  type2 ce bit kad napravimo admina
            }
          }
        })
      }
      res.status(200).json(response)
    } else {
      res.status(404).json({message: 'users not found'})
    }
  }).catch(error => {
    console.log(error)
    res.status(500).json({error: error})
  })
})

//  novi user
router.post('/signup', function (req, res) {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    pass: req.body.pass,
    rank: 1
  })
  user.save().then(result => {
    const token = jwt.sign({
      email: user.email,
      userId: user._id,
      rank: user.rank
    }, 'kljuc', {expiresIn: '3h'})
    console.log(result)
    res.status(201).json({
      newUser: {
        _id: user._id,
        email: user.email,
        rank: user.rank,
        token: token
      },
      Request: {
        type: 'GET, DELETE',
        url: 'http://localhost:3000/users/' + user._id
      }
    })
  }).catch(error => {
    console.log(error)
    res.status(400).json({
      error: error
    })
  })
})

router.post('/login', function (req, res) {
  User.find({email: req.body.email}).exec().then(response => {
    if (response.length) {
      if (response[0].pass === req.body.pass) {
        //  logiraj usera,token i takve stvari
        const token = jwt.sign({
          email: response[0].email,
          userId: response[0]._id,
          rank: response[0].rank
        }, 'kljuc', {expiresIn: '3h'})
        res.status(200).json({
          message: 'You are now logged in',
          token: token
        })
      } else {
        res.status(401).json({error: 'Wrong credentials'})
      }
    } else {
      res.status(401).json({error: 'Wrong credentials'})
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
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
    res.status(500).json({error: err})
  })
})

router.get('/:userId', checkAuth, function (req, res) {
  res.status(200).json({
    _id: res.userData._id,
    email: res.userData.email,
    rank: res.userData.rank,
    request: {
      type1: 'GET',
      url1: 'http://localhost:3000/entry/us/' + res.userData._id
      //  type2 ce bit kad napravimo admina
    }
  })
})
//  brisanje usera i njegovih unosa
router.delete('/:userId', checkAuth, function (req, res) {
  const id = req.params.userId
  User.remove({_id: id}).exec().then(a => {
    if (a) {
      res.status(200).json({message: 'User deleted'})
      Entry.remove({userId: id}).exec().then().catch(err => {
        console.log(err)
      })
    } else {
      res.status(404).json({message: 'No user with that Id'})
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
