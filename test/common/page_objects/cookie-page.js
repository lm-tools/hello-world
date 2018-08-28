const Page = require('./page');

class CookiePage extends Page {

  visit() {
    return this.browser.visit(this.routes.cookieUrl());
  }

  isDisplayed() {
    return !! this.extractText('cookie-title');
  }

  isAppCookieSectionDisplayed() {
    return !! this.browser.text('[data-test="app-cookie-table"]');
  }

  getAppCookieTableData() {
    return this.browser.queryAll('[data-test="app-cookie"]')
      .map(cookieEl => ({
        name: this.browser.text('[data-test="app-cookie-name"]', cookieEl),
        purpose: this.browser.text('[data-test="app-cookie-purpose"]', cookieEl),
        expires: this.browser.text('[data-test="app-cookie-expires"]', cookieEl),
      }));
  }
}
module.exports = CookiePage;
