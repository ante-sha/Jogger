'use strict';

const entryService = require('../../api/services/entryService');


describe('entryService tests', function () {

    it('should return error on bad ID', function (done) {
        const id = 'FAKE_ID';
        entryService.getEntryById(id).should.be.rejected.and.notify(done)
    })
    it('should return properties', function (done) {
        const id = '5b6b67e00000000000000000';
        entryService.getEntryById(id).should.have.property('entry').and.notify(done)
    })

})
