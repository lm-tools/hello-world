/* eslint-disable no-underscore-dangle */
const express = require('express');
const router = new express.Router();

router.get('/cookie', (req, res) => {
  res.render('cookie');
});

module.exports = router;
