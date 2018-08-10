/*
'use strict'
const mongoose = require('mongoose')
const entryService = require('../../api/services/entryService')
const verifyService = require('../../api/services/verifyService')
const userService = require('../../api/services/userService')
const reportsService = require('../../api/services/reportsService')
const assert = require('chai').assert
const expect = require('chai').expect
let entryId
const help = require('../testData.js')
const fake = { _id: '5b615a3161aab320e4de' }
const dummy = {email: 'testni2@user.com', pass: '123456', token: ''}

describe('ALL tests', function () {
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
//  REPORTS************************************************************
  //  getReport
  it('should return report array', function (done) {
    const req = {
      params: {
        userId: help.user.id
      }
    }
    reportsService.getReport(req).then(doc => {
      expect(doc.report).to.be.an('array')
      done()
    })
  })
  it('shouldn\'t return report', function (done) {
    const req = {
      params: {
        userId: fake._id
      }
    }
    reportsService.getReport(req).should.be.rejected.and.notify(done)
  })
  //  entry post
  it('should return error on Wrong inputs, length', function (done) {
    const req = {
      body: {
        userId: new mongoose.Types.ObjectId(),
        duration: '3',
        length: '0',
        date: new Date()
      }
    }
    entryService.postEntry(req).catch(err => {
      expect(err.message).to.equal('Wrong inputs')
      done()
    })
  })
  it('should return error on Wrong inputs, userId', function (done) {
    const req = {
      body: {
        userId: fake._id,
        duration: '3',
        length: '1',
        date: new Date()
      }
    }
    entryService.postEntry(req).catch(err => {
      expect(err.message).to.equal('Wrong inputs')
      done()
    })
  })
  it('should return error on Wrong inputs, date', function (done) {
    const req = {
      body: {
        userId: help.user.id,
        duration: '3',
        length: '1',
        date: '20180827'
      }
    }
    entryService.postEntry(req).catch(err => {
      expect(err.message).to.equal('Wrong inputs')
      done()
    })
  })
  it('should return error on Wrong inputs, duration', function (done) {
    const req = {
      body: {
        userId: help.user.id,
        duration: 'abba',
        length: '1',
        date: '2018-08-27'
      }
    }
    entryService.postEntry(req).catch(err => {
      expect(err.message).to.equal('Wrong inputs')
      done()
    })
  })
  it('should post new entry', function (done) {
    const req = {
      body: {
        userId: help.user.id,
        duration: 705,
        length: Math.random() * 500 + 1,
        date: new Date()
      }
    }
    entryService.postEntry(req).then(result => {
      entryId = result._id
    }).should.be.fulfilled.and.notify(done)
  })

  //  entry patch
  it('shouldn\'t patch an entry, string values', function (done) {
    const req = {
      body: {
        newDuration: 'sdga',
        newLength: Math.random() * 500 + 1,
        newDate: new Date()
      }
    }
    entryService.patchEntryById(entryId, req).catch(err => {
      expect(err.message).to.equal('Some of the fields are not valid')
      done()
    })
  })
  it('shouldn\'t patch an entry, "negative" date', function (done) {
    const req = {
      body: {
        newDuration: Math.random() * 500 + 1,
        newLength: Math.random() * 500 + 1,
        newDate: '2017-08-09'
      }
    }
    entryService.patchEntryById(entryId, req).should.be.rejected.and.notify(done)
  })
  it('shouldn\'t patch an entry, string date', function (done) {
    const req = {
      body: {
        newDuration: Math.random() * 500 + 1,
        newLength: Math.random() * 500 + 1,
        newDate: 'parac'
      }
    }
    entryService.patchEntryById(entryId, req).catch(err => {
      expect(err.message).to.equal('Some of the fields are not valid')
      done()
    })
  })
  it('shouldn\'t patch an entry, fake id', function (done) {
    const req = {
      body: {
        newDuration: Math.random() * 500 + 1,
        newLength: Math.random() * 500 + 1,
        newDate: new Date()
      }
    }
    entryService.patchEntryById(fake._id, req).catch(err => {
      expect(err.message).to.equal('Some of the fields are not valid')
      done()
    })
  })
  it('should patch an entry', function (done) {
    const req = {
      body: {
        newDuration: Math.random() * 500 + 1,
        newLength: Math.random() * 500 + 1,
        newDate: new Date()
      }
    }
    entryService.patchEntryById(entryId, req).then(result => {
      expect(result.message).to.equal('Entry modified')
      done()
    })
  })

  //  entry get by id
  it('should return error on bad ID', function (done) {
    const id = fake._id
    entryService.getEntryById(id).catch(error => {
      expect(error.message).to.equal('Not found')
      done()
    })
  })
  it('should return properties', function (done) {
    const id = entryId
    entryService.getEntryById(id).then(result => {
      // result.should.have.property('userId')
      assert.containsAllKeys(result, ['_id', 'userId', 'duration', 'length', 'date'])
      done()
    })
  })

  //  entry get by user id
  it('shouldn\'t return entries', function (done) {
    const userId = fake._id
    entryService.getEntriesByUserId(userId).should.be.rejected.and.notify(done)
  })
  it('should return entries', function (done) {
    const userId = help.user.id
    entryService.getEntriesByUserId(userId).then(result => {
      expect(result.entry).to.be.an('array')
    }).should.be.fulfilled.and.notify(done)
  })

  //  entry delete
  it('shouldn\'t delete entry', function (done) {
    const id = fake._id
    const req = ''
    entryService.deleteEntryById(id, req).should.be.rejected.and.notify(done)
  })
  it('should delete entry', function (done) {
    const id = entryId
    const req = ''
    entryService.deleteEntryById(id, req).should.be.fulfilled.and.notify(done)
  })
})
//
*/
