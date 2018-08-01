'use strict'

const Entry = require('../models/entry')
const User = require('../models/users')

module.exports = {
  getAllEntries: function () {
    return new Promise((resolve, reject) => {
      Entry.find().exec().then(docs => {
        resolve({
          Count: docs.length,
          Entries: docs.map(doc => {
            return {
              _id: doc._id,
              userId: doc.userId,
              duration: doc.duration,
              length: doc.length,
              date: doc.date,
              request: {
                type1: 'GET, DELETE, PATCH',
                url1: 'http://localhost:3000/entry/' + doc._id,
                type2: 'GET',
                url2: 'http://localhost:3000/entry/users/' + doc.userId
              }
            }
          })
        })
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },

  patchPromote: (req) => {
    return new Promise((resolve, reject) => {
      User.update({_id: req.body.userId}, {$set: {rank: req.body.newRank}}).exec().then(
        resolve({
          message: 'Success',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/users/' + req.body.userId
          }
        })).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}
