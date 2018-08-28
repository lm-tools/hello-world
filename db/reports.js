const knex = require('../app/db').knex;

module.exports = {
  getUserCount: function getTotalSortedActivities() {
    return knex('users')
      .count('*')
      .then(results => ({ userCount: results[0].count }));
  },
};
