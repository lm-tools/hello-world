const Page = require('./page');

class MainPage extends Page {
  visit() {
    return this.browser.visit(this.routes.mainUrl());
  }
}

module.exports = MainPage;
