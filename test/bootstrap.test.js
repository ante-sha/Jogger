'use strict';
const app = require('../index');

before(function(done) {
    // // Increase the Mocha timeout so that has enough time to lift.
    this.timeout(1000);

    done();

});

after(function(done) {
    // here you can clear fixtures, etc.
    done();
});
