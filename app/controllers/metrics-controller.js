const express = require('express');
const router = new express.Router({ mergeParams: true });
const report = require('./../../db/reports');

router.get('/', (req, res, next) => {
  report.getUserCount()
    .then(result => res.status(200).send(result))
    .catch(e => next(e));
});

module.exports = router;
