var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	pdf_name:{
		type: String,
		required: true,
	},
	name:{
		type: String,
		required: true,
	},
	bank:{
		type: String,
		required: true,
	},
	timestamp:{
		type: Date,
		default: Date.now
	},
	expire_timestamp:{
		type: Date,
		default: Date.now() + 1000*60*60*24*2,
	},
});

module.exports = mongoose.model('details', userSchema);
