class CookiePage {
  constructor(browser) {
    this.browser = browser;
  }

  visit() {
    return this.browser.visit('/cookie');
  }

  isDisplayed() {
    return !! this.browser.text('[data-test="cookie-title"]');
  }

}
module.exports = CookiePage;
