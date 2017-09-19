const morgan = require('morgan');
const fs = require('fs');

function colorForStatus(status) {
  if (status >= 500) {
    return 31; // red
  }
  if (status >= 400) {
    return 33; // yellow
  }
  if (status >= 300) {
    return 36; // cyan
  }
  if (status >= 200) {
    return 32; // green
  }
  return 0; // no color
}

morgan.format('dev+', function developmentFormatLine(tokens, req, res) {
  // eslint-disable-next-line
  'use strict';
  // get the status code if response written
  // eslint-disable-next-line no-underscore-dangle
  const status = res._header
    ? res.statusCode
    : undefined;

  // get status color
  const color = colorForStatus(status);

  // get colored function
  let fn = developmentFormatLine[color];

  if (!fn) {
    // compile
    // eslint-disable-next-line
    fn = developmentFormatLine[color] = morgan.compile('\x1b[0m:method :url \x1b['
      + color + 'm:status \x1b[0m:response-time ms - :res[content-length]\x1b[0m ' +
      ':req[x-request-id]');
  }

  return fn(tokens, req, res);
});

// Morgan JSON output. Ensure duration is float
morgan.token('duration', (req, res) => parseFloat(morgan['response-time'](req, res)));

function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    status: tokens.status(req, res),
    bytes: tokens.res(req, res, 'content-length'),
    duration: tokens.duration(req, res),
  });
}

module.exports.init = (env) => {
  if (env === 'test') {
    return morgan('tiny', {
      stream: fs.createWriteStream(`${__dirname}/logs/test.log`, { flags: 'w' }),
    });
  } else if (env === 'production') {
    return morgan(jsonFormat);
  }
  return morgan('dev+');
};
