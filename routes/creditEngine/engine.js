var request = require('request');
var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var pdftext = require('pdf-textstring');
var moment = require('moment');
var constants = require('./constants.js');
var mongoose = require('mongoose');
var router = express.Router();

// Connect with Database
var details = mongoose.model('details');

// var ICICIBANKFORMAT = constants.ICICIBANKFORMAT;
// var KOTAKBANKFORMAT = constants.KOTAKBANKFORMAT;
// var CITIBANKFORMAT = constants.CITIBANKFORMAT;
// var ORIENTALBANKFORMAT = constants.ORIENTALBANKFORMAT;
// var KARURAVYSYABANKFORMAT = constants.KARURAVYSYABANKFORMAT;
// var UBIBANKFORMAT = constants.UBIBANKFORMAT;             // United Bank of India
// var HDFCBANKFORMAT = constants.HDFCBANKFORMAT;
// var IDBIBANKFORMAT = constants.IDBIBANKFORMAT;
// var BOBBANKFORMAT = constants.BOBBANKFORMAT;
// var SBIBANKFORMAT = constants.SBIBANKFORMAT;
// var INDUSLANDBANKFORMAT = constants.INDUSLANDBANKFORMAT;
// var INDIANOVERSEASBANKFORMAT = constants.INDIANOVERSEASBANKFORMAT;

// Function for Save bankStatement Pdf in uploads folder
var bankStatement = function(req,res,next){
	var fileData = req.body.bankStatement;
	if(fileData){
		var fileName = crypto.randomBytes(16).toString('hex')+".PDF";
		fs.writeFile('public/uploads/'+fileName, fileData.replace(/ /g, '+') , 'base64',
		function(err){
			if (err){
			   console.log(err);
			   unlink(req.uploads);
			   res.json({success:false,error:"Error Uploading Bank Statement"});
			}else{
				req.bankStatement=fileName;
				next();
			}
		});
	}else{
		next();
	}
};

// function for counting words
function count(str,char) {
	var re = new RegExp(char,"gi");
	return (str.match(re) || []).length;
}

// Route for calculating dates
module.exports.pdfAnalysis = [bankStatement, function(req, res, next) {
	var userName = req.body.userName;
	var bankName = req.body.bankName;
	pdftext.pdftotext('public/uploads/'+req.bankStatement, function (err, data) {
		if(err){
			console.log(err);
			res.json({success:false,error:err});
		}else{

			var pdf_detail = new details({
				pdf_name : req.bankStatement,
				name : userName,
				bank : bankName,
			});
			pdf_detail.save(function(err,doc){
				if(err){
					console.log(err);
					res.json({success:false, error:"Some internal error occoured, Please contact admin"});
				}else{
					if (bankName == 'sbi') {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)),time0:(count(data,moment().subtract(0, 'month').format('MMM YYYY'))), time1:(count(data,moment().subtract(1, 'month').format('MMM YYYY'))), time2:(count(data,moment().subtract(2, 'month').format('MMM YYYY')))});

					} else if (bankName == 'kotak' || bankName == 'icici' || bankName == 'citi' || bankName == 'oriental' || bankName == 'karuravysya' || bankName == 'pnb' || bankName == 'federal' || bankName == 'indian' || bankName == 'corporation' || bankName == 'bandhan' || bankName == 'cub' || bankName == 'rbl') {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)),time0:(count(data,moment().subtract(0, 'month').format('MM/YYYY'))), time1:(count(data,moment().subtract(1, 'month').format('MM/YYYY'))), time2:(count(data,moment().subtract(2, 'month').format('MM/YYYY')))});

					} else if (bankName == 'ubi' || bankName == 'axis' || bankName == 'karnataka' || bankName == 'cbi' || bankName == 'andhra') {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)),time0:(count(data,moment().subtract(0, 'month').format('MM-YYYY'))), time1:(count(data,moment().subtract(1, 'month').format('MM-YYYY'))), time2:(count(data,moment().subtract(2, 'month').format('MM-YYYY')))});

					} else if (bankName == 'hdfc' || bankName == 'idbi' || bankName == 'bob') {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)),time0:(count(data,moment().subtract(0, 'month').format('MM/YY'))), time1:(count(data,moment().subtract(1, 'month').format('MM/YY'))), time2:(count(data,moment().subtract(2, 'month').format('MM/YY')))});

					} else if ( bankName == 'indianoverseas' && bankName == 'indusind' || bankName == 'canara'|| bankName == 'dbs') {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)),time0:(count(data,moment().subtract(0, 'month').format('MMM-YYYY'))), time1:(count(data,moment().subtract(1, 'month').format('MMM-YYYY'))), time2:(count(data,moment().subtract(2, 'month').format('MMM-YYYY')))});

					} else {
						console.log(bankName);
						res.json({success:true,userName:(count(data,userName)), msg:"Bank not found!"});

					}
				}
			});
		}
	});
}];

// Route for All bank list which are available in Database.
module.exports.bankList = function(req, res, next) {
	var list = [
		{text:'State Bank of india',value:'sbi'},
		{text:'Kotak Mahindra Bank',value:'kotak'},
		{text:'ICICI',value:'icici'},
		{text:'Citibank',value:'citi'},
		{text:'Oriental Bank of Commerce',value:'oriental'},
		{text:'Karur Vysya Bank',value:'karuravysya'},
		{text:'Punjab National Bank',value:'pnb'},
		{text:'United Bank of India',value:'ubi'},
		{text:'Axis Bank',value:'axis'},
		{text:'HDFC Bank',value:'hdfc'},
		{text:'IDBI Bank',value:'idbi'},
		{text:'Bank of Baroda',value:'bob'},
		{text:'Indian Overseas Bank',value:'indianoverseas'},
		{text:'IndusInd Bank',value:'indusind'},
		{text:'Canara Bank',value:'canara'},
		{text:'RBL Bank',value:'rbl'},
		{text:'City Union Bank',value:'cub'},
		{text:'Bandhan Bank',value:'bandhan'},
		{text:'Corporation Bank',value:'corporation'},
		{text:'Indian Bank',value:'indian'},
		{text:'Federal Bank',value:'federal'},
		{text:'Andhra Bank',value:'andhra'},
		{text:'Central Bank of India',value:'cbi'},
		{text:'Karnataka Bank',value:'karnataka'},
		{text:'DBS Bank',value:'dbs'},
	]
	res.json({success:true,dialog:true,title:"Choose Your Bank",list:list});
};
