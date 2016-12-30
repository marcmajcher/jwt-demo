const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userdb = require('../userdb');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'JWT Demo'
  });
});

const verifyJWT = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
      if (err) {
        const err = new Error('Authentication failed.');
        err.status = 500;
        next(err);
      }
      else {
        console.log('GOT TOKEN', decoded);
        req.decodedToken = decoded;
        next();
      }
    });
  }
  else { // no token
    res.status(403).send('NOT AUTHORIZED');
  }
}


router.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body;
  if (username in userdb) {
    if (password === userdb[username].password) {
      const user = userdb[username];
      delete user.password;
      const token = jwt.sign(user, process.env.secretKey);
      res.send(`good job, ${username}. Have a token: ${token}`);
    }
    else {
      const err = new Error('Bad password'); // Don't do this for real.
      err.status = 500;
      next(err);
    }
  }
  else {
    const err = new Error('Bad username'); // Don't do this for real.
    err.status = 500;
    next(err);
  }
});

router.get('/public', (req, res) => {
  res.send('EVERYONE CAN SEE THIS')
});

router.get('/private', verifyJWT, (req, res) => {
  res.send('THIS IS SECRET');
})

module.exports = router;
