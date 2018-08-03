'use strict'
const mongoose = require('mongoose')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const Entry = require('../models/entry')

module.exports = {
  getAllVisUsers: (req) => {
    return new Promise((resolve, reject) => {
      User.find({ rank: { $lt: req.userData.rank } }).exec().then(doc => {
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
                  url1: 'http://localhost:3000/users/' + a._id,
                  type2: 'GET',
                  url2: 'http://localhost:3000/entry/users/' + a._id
                }
              }
            })
          }
          resolve(response)
        } else {
          const err = new Error('Users not found')
          reject(err)
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  postSignUp: (req) => {
    return new Promise((resolve, reject) => {
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
        resolve({
          token: token,
          user: {
            _id: user._id,
            rank: user.rank
          },
          Request: {
            type: 'GET, DELETE',
            url: 'http://localhost:3000/users/' + user._id
          }
        })
      }).catch(error => {
        console.log(error)
        error.message = 'Email has to be unique and valid'
        reject(error)
      })
    })
  },

  postLogin: (req) => {
    return new Promise((resolve, reject) => {
      User.findOne({email: req.body.email}).exec().then(response => {
        if (response) {
          if (response.pass === req.body.pass) {
            //  logiraj usera,token i takve stvari
            console.log(response._id)
            const token = jwt.sign({
              email: response.email,
              userId: response._id,
              rank: response.rank
            }, 'kljuc', {expiresIn: '3h'})
            resolve({
              message: 'You are now logged in',
              token: token,
              user: {
                _id: response._id,
                rank: response.rank
              },
              request: {
                type: 'GET',
                url: 'http://localhost/entry/users/' + response._id
              }
            })
          } else {
            const error = new Error('Wrong credentials')
            reject(error)
          }
        } else {
          const error = new Error('Wrong credentials')
          reject(error)
        }
      }).catch(err => {
        console.log(err)
        err.message = 'Wrong credentials'
        reject(err)
      })
    })
  },

  getOneUser: (res) => {
    return new Promise((resolve, reject) => {
      resolve({
        _id: res.userData._id,
        email: res.userData.email,
        rank: res.userData.rank,
        request: {
          type1: 'DELETE',
          url1: 'http://localhost:3000/entry/users/' + res.userData._id
          //  type2 ce bit kad napravimo admina
        }
      })
    })
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      User.remove({_id: id}).exec().then(a => {
        return Entry.remove({userId: id}).exec()
      }).then(b => resolve({message: 'User deleted'})).catch(err => {
        console.log(err)
        err.message = 'User not found'
        reject(err)
      })
    })
  }
}
