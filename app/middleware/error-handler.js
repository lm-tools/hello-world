const i18n = require('i18n');
const winston = require('winston');
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      json: true,
      stringify: JSON.stringify,
    }),
  ],
});

module.exports = app => {
  /* eslint-disable no-underscore-dangle */
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (app.get('env') !== 'test') {
      logger.error(err.stack);
    }
    const status = err.status || 500;
    res.status(status);
    const model = { message: i18n.__(`error.${status}`) };
    if (app.get('env') === 'development') {
      model.error = err;
    }
    res.render('error', model);
  });
};
