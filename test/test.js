'use strict';


const testData = require('./testData');

global.chai = require('chai');
global.chaiAsPromised = require('chai-as-promised');
global.chai.use(global.chaiAsPromised);
global.chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.testData = testData;

describe('', function () {

  beforeEach(function () {
    this.timeout(500);
  })

  // it('ALL tests', function (done) {
  //   require('./unit/alltogether.test')
  //   done()
  // })

  it('USER tests', function (done) {
    require('./unit/userService.test')
    done()
  })

  it('REPORTS tests', function (done) {
    require('./unit/reportsService.test')
    done()
  })

  it('ENTRY tests', function (done) {
    require('./unit/entryService.test')
    done()
  })

  it('MANAGE tests', function (done) {
    require('./unit/manageService.test')
    done()
  })

});
