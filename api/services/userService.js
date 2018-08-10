'use strict'
const mongoose = require('mongoose')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const Entry = require('../models/entry')
const bcrypt = require('bcrypt')
const mailVerService = require('../services/mailVerService')

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
                verify: a.verify,
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
          resolve({count: 0, users: []})
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  postSignUp: (req) => {
    return new Promise((resolve, reject) => {
      if (req.body.pass.length >= 6 && req.body.pass.length <= 12) {
        bcrypt.hash(req.body.pass, 10, (err, hash) => {
          if (err) return reject(err)
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              pass: hash,
              rank: 1,
              verify: false
            })
            user.save().then(result => {
              console.log(result)
              mailVerService.sendConfirmationEmail(req.body.email).then(info => resolve({info, userId: user._id})).catch(err => console.log(err))
            }).catch(error => {
              console.log(error)
              error.message = 'Email has to be unique and valid'
              reject(error)
            })
          }
        })
      } else {
        const error = new Error('Password is not valid!')
        error.status = 400
        reject(error)
      }
    })
  },

  postLogin: (req) => {
    return new Promise((resolve, reject) => {
      User.findOne({email: req.body.email}).exec().then(response => {
        if (response && response.verify) {
          bcrypt.compare(req.body.pass, response.pass, (err, res) => {
            if (err) {
              reject(err)
            }
            if (res) {
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
          })
        } else if (response.verify === false) {
          const error = new Error('Validate your mail first')
          reject(error)
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
        verify: res.userData.verify,
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
