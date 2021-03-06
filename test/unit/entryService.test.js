'use strict'
const mongoose = require('mongoose')
const entryService = require('../../api/services/entryService')
const assert = require('chai').assert
const expect = require('chai').expect
let entryId
const help = require('../testData.js')
const fake = { _id: '5b615a3161aab320e4de' }

describe('ENTRY tests', function () {
//  Entry

//  entry post++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
        duration: 'A',
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

  //  entry patch+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

  //  entry get by id+++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

  //  entry get by user id+++++++++++++++++++++++++++++++++++++++++++++++++++

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
  it('should return entries', function (done) {
    const userId = help.emptyUser.id
    entryService.getEntriesByUserId(userId).then(result => {
      expect(result.entry).to.be.an('array')
    }).should.be.fulfilled.and.notify(done)
  })

  //  entry delete+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
