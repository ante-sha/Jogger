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
          //          res.status(200).json(response)
          resolve(response)
        } else {
          //    res.status(404).json({message: 'Entries not found'})
          resolve({message: 'User has no entries'})
        }
      }).catch(error => {
        console.log(error)
        //        res.status(500).json({message: error})
        error.message = 'Something went wrong'
        reject(error)
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
        reject(err)
      })
    })
  },

  patchEntryById: (id, req) => {
    return new Promise((resolve, reject) => {
      Entry.update({_id: id}, {
        $set: {
          duration: req.body.newDuration,
          length: req.body.newLength,
          date: req.body.newDate
        }
      }).exec().then(result => {
        console.log(result)
        resolve({
          message: 'Entry modified',
          request: {
            type1: 'GET, DELETE, PATCH',
            url1: 'http://localhost:3000/entry/' + id,
            type2: 'GET',
            url2: 'http://localhost:3000/entry/users/' + req.userData.userId
          }
        })
      }).catch(err => {
        console.log(err)
        err.message = 'Some of the fields are not valid'
        reject(err)
      })
    })
  },

  deleteEntryById: (id, req) => {
    return new Promise((resolve, reject) => {
      Entry.remove({_id: id}).exec().then(result => {
        console.log(result)
        //  res.status(200).json({message: 'Entry deleted'})
        resolve({
          message: 'Entry deleted',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/entry/users/' + req.userData.userId
          }
        })
      }).catch(err => {
        console.log(err)
        err.message = 'Wrong entryId'
        reject(err)
      })
    })
  }
}
