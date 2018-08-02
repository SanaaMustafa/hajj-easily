

var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.get('/register', function(req, res, next) {
  res.render('./user/register',{title:'sign up'});
});*/


module.exports = router;
