const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/auth')
const Entry = require('../models/entry')
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
  Entry.find().exec().then(docs => {
    res.status(200).json({
      Count: docs.length,
      Entries: docs.map(doc => {
        return {
          _id: doc._id,
          userId: doc.userId,
          duration: doc.duration,
          length: doc.length,
          week: doc.week,
          request: {
            type1: 'GET, DELETE, PATCH',
            url1: 'http://localhost:3000/entry/' + doc._id,
            type2: 'GET',
            url2: 'http://localhost:3000/entry/us/' + doc.userId
          }
        }
      })
    })
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})

//  uređivanje unosa
router.patch('/promote', function (req, res) {
  User.update({_id: req.body.userId}, {$set: {rank: req.body.newRank}}).exec().then(
    res.status(200).json({message: 'Success'})).catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

//  brisanje unosa

module.exports = router
