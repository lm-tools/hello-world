/* eslint-disable no-underscore-dangle */
const express = require('express');
const router = new express.Router();
const i18n = require('i18n');

router.get('/cookie', (req, res) => {
  res.render('cookie', { appSpecificCookies: i18n.__('cookie.appSpecific.cookies') });
});

module.exports = router;
