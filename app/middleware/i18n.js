const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true,
  objectNotation: true,
  useCookie: false,
  updateFiles: true,
  indent: '  ',
});


module.exports = app => {
  app.use((req, res, next) => {
    /* eslint-disable prefer-arrow-callback, no-underscore-dangle, no-param-reassign */
    // mustache helper
    res.locals.__ = () =>
      function (...args) {
        return i18n.__.apply(req, args);
      };
    next();
    /* eslint-enable */
  });
  // i18n.init seems not to work properly with hogan
  // app.use(i18n.init);
};
