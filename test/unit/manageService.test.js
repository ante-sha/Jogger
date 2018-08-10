'use strict'
const manageService = require('../../api/services/manageService')
const expect = require('chai').expect
const help = require('../testData.js')
const fake = { _id: '5b615a3161aab320e4de' }

describe('MANAGE tests', function () {

  //  all entries++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('should get all of the entries', function (done) {
    manageService.getAllEntries().then(doc => {
      expect(doc.Entries).to.be.an('array')
      done()
    })
  })

  // promote user++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  it('should promote user', function (done) {
    const req = {
      body: {
        userId: help.user.id,
        newRank: 2
      }
    }
    manageService.patchPromote(req).then(res => {
      expect(res.message).to.equal('Success')
      done()
    })
  })
  it('shouldn\'t promote user cause of fake id', function (done) {
    const req = {
      body:{
        userId: fake._id,
        newRank: 3
      }
    }
    manageService.patchPromote(req).should.be.rejected.and.notify(done)
  })
})
