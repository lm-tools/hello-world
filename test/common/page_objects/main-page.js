class MainPage {
  constructor(browser) {
    this.browser = browser;
  }

  visit() {
    return this.browser.visit('/');
  }
}
module.exports = MainPage;
