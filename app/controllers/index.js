const cookie = require('./cookie-controller');
const healthCheck = require('./health-check-controller');
const metrics = require('./metrics-controller');
const index = require('./index-controller');
const users = require('./users-controller');

module.exports = {
  cookie,
  healthCheck,
  metrics,
  index,
  users,
};
