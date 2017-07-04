/* eslint-disable no-underscore-dangle */
const helper = require('./support/integrationSpecHelper');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const cookiePage = helper.cookiePage;
const expect = require('chai').expect;

describe('Cookie page', () => {
  before(() =>
    cookiePage.visit()
  );

  it('should contain valid googleTagManager', () =>
    expect(googleTagManagerHelper.getUserVariable()).to.exists
  );

  it('displays govuk general cookie info', () =>
    expect(cookiePage.isDisplayed()).to.equal(true)
  );
});
