module.exports = function () {
  this.When(/^I visit the application root$/, function (callback) {
    this.visit('/', callback);
  });

  this.Then(/^I should see the GOV\.UK template$/, function () {
    this.browser.assert.element(".header-logo > #logo[href='https://www.gov.uk/']");
  });
};
