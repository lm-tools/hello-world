class Page {

  constructor({ browser, routes }) {
    this.browser = browser;
    this.routes = routes;
  }

  // eslint-disable-next-line no-unused-vars
  visit(...args) {
    throw new Error('Must implement the visit method');
  }

  /**
   * @param {string} dataTest - the data test element
   * @param {object} context - the core object returned from browser.querySelector. By default
   * uses the document
   * returns the text within the element
   */
  extractText(dataTest, context = this.browser) {
    return this.browser.text(`[data-test="${dataTest}"]`, context);
  }


  /**
   * @param {string} dataTest - the data test element
   * @param {object} context - the 'core' object returned from browser.querySelector. By default
   * uses the document
   * returns the text within the element
   */
  extractLink(dataTest, context = this.browser) {
    const href = this.browser.query(`[data-test="${dataTest}"]`, context).getAttribute('href');
    const text = this.extractText(dataTest, context);
    return { href, text };
  }

  /**
   * @param {string} dataTest - the data test element
   * @param {string} attribute - the attribute name
   * @param {object} context - the 'core' object returned from browser.querySelector. By default
   * uses the document
   * returns the attribute value
   */
  extractAttributeValue(dataTest, attribute, context = this.browser) {
    return this.browser.query(`[data-test="${dataTest}"]`, context).getAttribute(attribute);
  }

  /**
   * Find array of breadcrumbs.
   * @returns {*|Array}
   */
  getBreadcrumbs() {
    const resources = this.browser.queryAll('[data-test="crumb"]');
    return resources.map(crumb => this.extractText('title', crumb));
  }

  /**
   * Check id a data test element has a class
   * @param {string} dataTest - the data test element
   * @param {string} className - class to check
   * @param {object} context - the 'core' object returned from browser.querySelector. By default
   * uses the document
   * returns true if matches
   *
   */
  hasClass(dataTest, className, context = this.browser) {
    return this.browser.query(`[data-test="${dataTest}"]`, context)
        .className.split(' ').indexOf(className) > -1;
  }

}
module.exports = Page;
