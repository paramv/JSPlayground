var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	shortId = require('shortid');

shortId.seed(1000);

var ArticleSchema = new Schema({
	title: String,
	_id: {
		type:'String',
		unique:true,
		default:shortId.generate
	},
	jsVersion: String,
	jsContent: {type:String, required:true},
	htmlContent: String
});


mongoose.model('Article', ArticleSchema);