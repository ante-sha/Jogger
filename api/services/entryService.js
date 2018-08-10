'use strict'
const mongoose = require('mongoose')
const Entry = require('../models/entry')

module.exports = {
  getEntriesByUserId: (id) => {
    return new Promise((resolve, reject) => {
      Entry.find({userId: mongoose.Types.ObjectId(id)}).select('_id userId duration length date').exec().then(doc => {
        if (doc.length > 0) {
          const response = {
            count: doc.length,
            entry: doc.map(a => {
              return {
                _id: a._id,
                userId: a.userId,
                duration: a.duration,
                length: a.length,
                date: a.date,
                request: {
                  type1: 'GET, DELETE, PATCH',
                  url1: 'http://localhost:3000/entry/' + a._id,
                  type2: 'GET',
                  url2: 'http://localhost:3000/reports/' + a.userId
                }
              }
            })
          }
          resolve(response)
        } else {
          resolve({
            message: 'User has no entries',
            count: 0,
            entry: []
          })
        }
      }).catch(error => {
        console.log(error)
        const err = new Error()
        err.message = 'Something went wrong'
        reject(err)
      })
    })
  },

  postEntry: (req) => {
    return new Promise((resolve, reject) => {
      const entry = new Entry({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        duration: req.body.duration,
        length: req.body.length,
        date: req.body.date
      })
      entry.save().then(result => {
        const response = {
          _id: result._id,
          userId: result.userId,
          duration: result.duration,
          length: result.length,
          date: result.date
        }
        resolve(response)
      }).catch(error => {
        console.log(error)
        error.message = 'Wrong inputs'
        reject(error)
      })
    })
  },

  getEntryById: (id) => {
    return new Promise((resolve, reject) => {
      Entry.findById(id).exec().then(result => {
        if (result) {
          const response = {
            _id: result._id,
            userId: result.userId,
            duration: result.duration,
            length: result.length,
            date: result.date,
            request: {
              type1: 'DELETE, PATCH',
              url1: 'http://localhost:3000/entry/' + result._id,
              type2: 'GET',
              url2: 'http://localhost:3000/entry/users/' + result.userId
            }
          }
          resolve(response)
        } else {
          const error = new Error('Not found')
          reject(error)
        }
      }).catch(err => {
        console.log(err)
        err.message = 'Not found'
        reject(err)
      })
    })
  },

  patchEntryById: (id, req) => {
    return new Promise((resolve, reject) => {
      let p
      try {
        p = req.body.newDate.getTime() - new Date('2018-08-01').getTime()
      } catch (error) {
        error.message = 'Some of the fields are not valid'
        reject(error)
      }
      if (req.body.newDuration > 0 && req.body.newLength > 0 && p >= 0) {
        Entry.update({_id: id}, {
          $set: {
            duration: req.body.newDuration,
            length: req.body.newLength,
            date: req.body.newDate
          }
        }).exec().then(result => {
          console.log(result)
          resolve({
            message: 'Entry modified'
          })
        }).catch(err => {
          console.log(err)
          err.message = 'Some of the fields are not valid'
          reject(err)
        })
      } else {
        const error = new Error('Some of the fields are not valid')
        reject(error)
      }
    })
  },

  deleteEntryById: (id, req) => {
    return new Promise((resolve, reject) => {
      Entry.remove({_id: id}).exec().then(result => {
        console.log(result)
        resolve({
          message: 'Entry deleted'
        })
      }).catch(err => {
        console.log(err)
        err.message = 'Wrong entryId'
        reject(err)
      })
    })
  }
}
