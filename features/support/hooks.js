const knexCleaner = require('knex-cleaner');
const knex = require('../../db').knex;

module.exports = function () {
  /* eslint new-cap: 'off'*/
  this.Before(() => knexCleaner.clean(knex, { ignoreTables: ['knex_migrations'] }));
};
