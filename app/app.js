const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('./../logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { index, users, healthCheck, cookie, metrics } = require('./controllers/index');
const i18n = require('./middleware/i18n');
const errorHandler = require('./middleware/error-handler');
const helmet = require('helmet');
const layoutAssets = require('./models/assets');
const cacheHeaders = require('./middleware/cacheHeaders');

const app = express();
i18n(app);
app.use(helmet());
app.use(helmet.referrerPolicy());

// view engine setup
const cons = require('consolidate');
app.engine('mustache', cons.hogan);
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// run the whole application in a directory
const basePath = app.locals.basePath = process.env.EXPRESS_BASE_PATH || '';
const assetPath = `${basePath}/`;
const googleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID;

app.use('/health_check', healthCheck);
app.use(`${basePath}/health_check`, healthCheck);

// Middleware to set default layouts.
// This must be done per request (and not via app.locals) as the Consolidate.js
// renderer mutates locals.partials :(
app.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  Object.assign(res.locals, {
    assetPath,
    layoutAssets: layoutAssets({ assetPath }),
    basePath,
    googleTagManagerId,
    partials: {
      layout: 'layouts/main',
      govukTemplate:
        '../../vendor/govuk_template_mustache_inheritance/views/layouts/govuk_template',
      googleTagManager: 'partials/google-tag-manager',
      appCookies: 'partials/app-cookies',
    },
  });
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '..',
  'vendor', 'govuk_template_mustache_inheritance', 'assets', 'images', 'favicon.ico')));

// Configure logging
app.use(logger.init(app.get('env')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(assetPath, cacheHeaders);

app.use(`${assetPath}vendor/v1`, express.static(path.join(__dirname, '..',
  'vendor', 'govuk_template_mustache_inheritance', 'assets')));

app.use(assetPath, express.static(path.join(__dirname, '..', 'dist', 'public')));

app.use(helmet.noCache());

if (process.env.MI === 'true' || process.env.MI === true) {
  app.use(`${basePath}/metrics`, metrics);
} else {
  // revoke controller access to MI instance to avoid write attempts to replica db
  app.use(`${basePath}/`, index);
  app.use(`${basePath}/`, cookie);
  app.use(`${basePath}/users`, users);
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

errorHandler(app);

module.exports = app;
