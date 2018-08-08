// Update with your config settings.
module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      database: 'lmt_app_moved',
    },
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      database: 'lmt_app_moved_test',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 2,
    },
  },
};
