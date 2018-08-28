const cookie = require('./cookie-controller');
const healthCheck = require('./health-check-controller');
const index = require('./index-controller');
const metrics = require('./metrics-controller');
const users = require('./users-controller');

module.exports = {
  cookie,
  healthCheck,
  index,
  metrics,
  users,
};
