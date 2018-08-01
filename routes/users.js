var express = require('express');
var router = express.Router();
var creditEngine = require('./creditEngine/engine.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var auth = function(req, res, next) {
  // console.log(req.body);
	if(req.headers.authorization=='Ankit'){
		next();
	}else{
		res.json({success:false,error:"Unauthorized Device"});
	}
};

router.post('/pdfAnalysis', auth, creditEngine.pdfAnalysis);
router.post('/bankList', auth, creditEngine.bankList);

module.exports = router;
