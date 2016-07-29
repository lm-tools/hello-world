const helper = require('./support/integrationSpecHelper');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const mainPage = helper.mainPage;
const expect = require('chai').expect;

describe('Main', () => {
  it('should contain valid google tag manager data', () =>
    mainPage.visit()
      .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal('set-me-in-controller'))
  );
});

