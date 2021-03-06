'use strict'
const User = require('../models/users')
const jwt = require('jsonwebtoken')

module.exports = {
  validateUser (req) {
    return new Promise((resolve, reject) => {
      try {
        let decoded = jwt.verify(req.params.token, 'kljuc')
        User.update({email: decoded.email}, {
          $set: {
            verify: true
          }
        }).exec().then(result => {
          console.log(result)
          resolve({message: 'User verified'})
        })
      } catch (err) {
        err.message = 'Wrong url'
        reject(err)
      }
    })
  }
}
