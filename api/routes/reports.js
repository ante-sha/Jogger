const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//  const mongoose = require('mongoose')
const Entry = require('../models/entry')
const checkAuth = require('../middleware/auth')
const checkAuth2 = require('../middleware/auth2')

//  lista svih unosa istog usera
router.get('/:userId', checkAuth, checkAuth2, function (req, res) {
  Entry.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
    { $group: { _id: {week: '$week'}, duration: { $sum: '$duration' }, length: { $sum: '$length' } } },
    { $sort: { week: -1 } } ],
  (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({error: err})
    }
    res.status(200).json({
      userId: req.params.userId,
      Report: result.map(a => {
        return {
          week: a._id.week,
          length: a.length,
          duration: a.duration
        }
      }),
      Request: {
        type: 'GET',
        url: 'http://localhost:3000/entry/us/' + req.params.userId
      }
    })
  }).exec().catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
})

router.use('/', (req, res, next) => {
  const error = new Error('Method not allowed')
  error.status = 405
  next(error)
})

module.exports = router
