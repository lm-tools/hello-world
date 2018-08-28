const Page = require('./page');

class ErrorPage extends Page {

  visit(path) {
    return this.browser.visit(this.routes.url(path));
  }

  getMessage() {
    return this.extractText('message');
  }

  getErrorDetails() {
    return this.extractText('error-details');
  }
}

module.exports = ErrorPage;
