const express = require('express');
const router = new express.Router();
const UserModel = require('../models/users-model');

/* GET users listing. */
router.get('/', (req, res) =>
  UserModel.fetchAll().then((users) => res.send(users.serialize()))
);

router.post('/', (req, res, next) =>
  new UserModel(req.body).save()
    .then((user) => res.send(user.serialize()))
    .catch((err) => next(err))
);

module.exports = router;
