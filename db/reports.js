const knex = require('../app/db').knex;

module.exports = {
  getTotalNumberOfThingsForSomeIdJson: () =>
    knex('users')
      .select('name')
      .count('name as totalNames')
      .groupBy('name'),
};
