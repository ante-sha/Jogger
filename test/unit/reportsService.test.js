'use strict'
const reportsService = require('../../api/services/reportsService')
const expect = require('chai').expect
const help = require('../testData.js')
const fake = { _id: '5b615a3161aab320e4de' }

describe('REPORTS tests', function () {

// get reports+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
  it('should return report array', function (done) {
    const req = {
      params: {
        userId: help.emptyUser.id
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
})
