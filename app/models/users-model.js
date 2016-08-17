const db = require('../db');

module.exports = db.Model.extend(
  {
    tableName: 'users',
    hasTimestamps: true,
  }
);
