class GoogleTagManagerHelper {
  constructor(browser) {
    this.browser = browser;
  }

  getUserVariable() {
    return this.browser.window.dataLayer[0].userId;
  }
}
module.exports = GoogleTagManagerHelper;
