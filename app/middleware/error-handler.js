const i18n = require('i18n');

module.exports = app => {
  /* eslint-disable no-underscore-dangle */
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (app.get('env') !== 'test') {
      // eslint-disable-next-line no-console
      console.error(err.stack);
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
