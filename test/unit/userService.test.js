'use strict'
const verifyService = require('../../api/services/verifyService')
const userService = require('../../api/services/userService')
const assert = require('chai').assert
const expect = require('chai').expect
const help = require('../testData.js')
const fake = { _id: '5b615a3161aab320e4de' }
const dummy = {email: 'testni2@user.com', pass: '123456', token: ''}

describe('USER tests', function () {
  //  USER

  //  SignUp++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('should return error on duplicated email', function (done) {
    const req = {
      body: {
        pass: 'fasfjff',
        email: help.user.email
      }
    }
    userService.postSignUp(req).catch(err => {
      expect(err.message).to.equal('Email has to be unique and valid')
      done()
    })
  })
  it('should return error on too short password', function (done) {
    const req = {
      body: {
        pass: '1234',
        email: dummy.email
      }
    }
    userService.postSignUp(req).catch(err => {
      expect(err.message).to.equal('Password is not valid!')
      done()
    })
  })
  it('should reqister user', function (done) {
    const req = {
      body: {
        pass: dummy.pass,
        email: dummy.email
      }
    }
    userService.postSignUp(req).then(result => {
      dummy.id = result.userId
      dummy.verifyToken = result.info.token
    }).should.be.fulfilled.and.notify(done)
  })

  //  Login++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('shouldn\'t login user, verification', function (done) {
    const req = {
      body: {
        email: dummy.email,
        pass: dummy.pass
      }
    }
    userService.postLogin(req).catch(err => {
      expect(err.message).to.equal('Validate your mail first')
      done()
    })
  })
  it('shouldn\'t login user, wrong password', function (done) {
    const req = {
      body: {
        email: help.user.email,
        pass: help.user.pass + 'dod'
      }
    }
    userService.postLogin(req).catch(err => {
      expect(err.message).to.equal('Wrong credentials')
      done()
    })
  })
  it('shouldn\'t login user, wrong email', function (done) {
    const req = {
      body: {
        email: help.user.email + 'dod',
        pass: help.user.pass
      }
    }
    userService.postLogin(req).catch(err => {
      expect(err.message).to.equal('Wrong credentials')
      done()
    })
  })
  it('should login user', function (done) {
    const req = {
      body: {
        email: help.user.email,
        pass: help.user.pass
      }
    }
    userService.postLogin(req).should.be.fulfilled.and.notify(done)
  })

  //  verify user+++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('should\'t validate user', function (done) {
    const req = {
      params: {
        token: 'fhioashgohaogihsaoighsaoihog19h98hg'
      }
    }
    verifyService.validateUser(req).catch(err => {
      expect(err.message).to.equal('Wrong url')
      done()
    })
  })
  it('should validate user', function (done) {
    const req = {
      params: {
        token: dummy.verifyToken
      }
    }
    verifyService.validateUser(req).then(result => {
      expect(result.message).to.equal('User verified')
    }).should.be.fulfilled.and.notify(done)
  })

  //  delete user+++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('shouldn\'t delete user', function (done) {
    const id = fake._id
    userService.deleteUser(id).catch(err => {
      expect(err.message).to.equal('User not found')
      done()
    })
  })
  it('should delete user', function (done) {
    userService.deleteUser(dummy.id).then(result => {
      expect(result.message).to.equal('User deleted')
      done()
    })
  })

  //  getAllVisUsers++++++++++++++++++++++++++++++++++++++++++++++++++

  it('should return array of users', function (done) {
    const req = {
      userData: {
        rank: 2
      }
    }
    userService.getAllVisUsers(req).then(res => {
      expect(res.users).to.be.an('array')
      done()
    })
  })
  it('should return array of users', function (done) {
    const req = {
      userData: {
        rank: 1
      }
    }
    userService.getAllVisUsers(req).then(res => {
      expect(res.users).to.be.an('array')
      done()
    })
  })
})
