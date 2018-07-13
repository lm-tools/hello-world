const express = require('express');
const router = new express.Router({ mergeParams: true });
const report = require('./../../db/reports');

router.get('/:format?', (req, res) => {
  report.getTotalNumberOfThingsForSomeIdJson()
    .then(result => res.status(200).send(result))
    .catch(e => {
      throw new Error(e);
    });
});

module.exports = router;
