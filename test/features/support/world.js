const Zombie = require('zombie');
const basePath = process.env.EXPRESS_BASE_PATH || '';
const port = require('../../common/config').port;
const testServerPath = path => `http://localhost:${port}${basePath}${path}`;

process.env.GOOGLE_TAG_MANAGER_ID = 'fake-id';
process.env.PORT = port;

require('../../../bin/www'); // This starts the web server, and ensures it is only
                          // started once. It is a misuse of "require", and
                          // should be improved.


function World() {
  this.browser = new Zombie();

  this.visit = (relativeUrl, callback) => {
    this.browser.visit(testServerPath(relativeUrl), callback);
  };
}

module.exports = function () {
  this.World = World;
};
