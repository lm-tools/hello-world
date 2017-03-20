const Zombie = require('zombie');
Zombie.site = 'http://localhost:3000';
const browser = new Zombie();
const screenshots = require('./screenshots');
const GoogleTagManagerHelper = require('../../common/page_objects/google-tag-manager-helper');
const MainPage = require('../../common/page_objects/main-page');
const ErrorPage = require('../../common/page_objects/error-page');

process.env.GOOGLE_TAG_MANAGER_ID = 'fake-id';
const app = require('../../../bin/www');

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    screenshots.takeScreenshot(this.currentTest, browser);
  }
});

module.exports = {
  browser,
  googleTagManagerHelper: new GoogleTagManagerHelper(browser),
  mainPage: new MainPage(browser),
  errorPage: new ErrorPage(browser),
  app,
};
