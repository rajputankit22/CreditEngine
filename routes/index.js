var express = require('express');
var router = express.Router();
var test = require('./creditEngine/engine');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayMate' });
});

module.exports = router;
