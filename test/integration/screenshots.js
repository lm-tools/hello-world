const fs = require('fs');
const path = require('path');
const screenshotDir = path.join(__dirname, '..', '..', 'screenshots');
const moment = require('moment');

function testPath(test) {
  if (!test.parent) return [test.title];
  const idx = test.parent[test.type === 'test' ? 'tests' : 'suites'].indexOf(test);
  return testPath(test.parent).concat([idx, test.title]);
}

function sanitize(name) {
  return (`${name}`).replace(/\s/g, '-').replace(/[^\w-]/g, '').replace(/-+/g, '-');
}

function date() {
  return moment().format();
}

function testFileName(test) {
  return date() + testPath(test).map(sanitize).join('.');
}

module.exports = {
  takeScreenshot(test, browser) {
    const screenshotPath = path.join(screenshotDir, `${testFileName(test)}.html`);
    fs.writeFileSync(screenshotPath, browser.html());
  },
};
