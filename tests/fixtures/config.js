// Set global settings for all tests
beforeEach(function(done) {
  try {
    this.currentTest.timeout(10000);
    this.currentTest.slow(1000);
    done();
  }
  catch (e) {
    done(e);
  }
});
