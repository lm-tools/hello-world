const express = require('express');
const router = new express.Router();
const db = require('../db');

router.get('', (req, res) =>
  db.knex.raw('select 1+1 as result').then(() =>
    res.json({
      status: 'ok',
      database: 'up',
    })
  ).catch(() =>
    res.status(500).json({
      status: 'failure',
      database: 'down',
    })));

module.exports = router;
