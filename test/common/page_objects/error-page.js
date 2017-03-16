class ErrorPage {
  constructor(browser) {
    this.browser = browser;
  }

  getMessage() {
    return this.browser.text('[data-test="message"]');
  }

  getErrorDetails() {
    return this.browser.text('[data-test="error-details"]');
  }
}

module.exports = ErrorPage;
