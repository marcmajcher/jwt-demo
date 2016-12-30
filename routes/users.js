const express = require('express');
const router = express.Router();
const userdb = require('../userdb');

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('login', {
    title: 'Log in'
  });
});

module.exports = router;
