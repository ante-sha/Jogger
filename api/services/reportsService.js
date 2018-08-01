'use strict'

const mongoose = require('mongoose')
const Entry = require('../models/entry')

module.exports = {
  getReport: (req) => {
    return new Promise((resolve, reject) => {
      Entry.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
        { $group: { _id: { year: { $year: '$date' }, week: { $week: '$date' } }, duration: { $sum: '$duration' }, length: { $sum: '$length' } } },
        { $sort: { _id: 1 } } ],
      (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve({
            userId: req.params.userId,
            report: result.map(a => {
              return {
                week: a._id.week,
                year: a._id.year,
                length: a.length,
                duration: a.duration
              }
            }),
            Request: {
              type: 'GET',
              url: 'http://localhost:3000/entry/users/' + req.params.userId
            }
          })
        }
      })
    })
  }
}
