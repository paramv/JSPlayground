var express = require('express'),
	util = require('util'),
	extend = util._extend,
	router = express.Router(),
	fs = require('fs'),
	ejs = require('ejs'),
	mongoose = require('mongoose'),
	Article = mongoose.model('Article');


var defaultConfig = {
	jsVersionsAvailable: ['1.5', '1.6', '1.7'],
	jsContent: '',
	htmlContent: '',
	jsVersion: '1.5',
	status: 'valid',
	_id: undefined
};


module.exports = function(app) {
	app.use('/', router);
};
router.get('/', function(req, res, next) {
	var config;
	if (req.query.status === 'invalid') {
		config = extend({}, defaultConfig);
		config.status = 'invalid';
		res.render('index', config);
	} else {
		res.render('index', defaultConfig);
	}

});
router.get('/:id', function(req, res, next) {
	var id = req.params.id,
		config = extend({},defaultConfig);
	Article.findOne({
		'_id': id
	}, function(err, article) {
		if (err) return next(err);
		if (!article) {
			res.redirect('/?status=invalid');
			return;
		}
		
		res.render('index', extend(config, article._doc));
	});
});


router.post('/update/:id', function(req, res, next) {
	var body,
		jsVersion,
		htmlContent,
		jsContent,
		id;

	id = req.params.id;
	body = req.body;
	jsVersion = body.jsVersion || '1.5';
	jsContent = body.jsContent || '';
	htmlContent = body.htmlContent || '';
	Article.findOne({
		'_id': id
	}, function(err, article) {
		if (err) return next(err);
		article.jsContent = jsContent;
		article.htmlContent = htmlContent;
		article.jsVersion = jsVersion;
		article.save(function(err, art) {
			if (err) return next(err);
			res.json({
				resp: 200
			});
		});
	});
});

router.delete('/delete/:id', function(req, res, next) {
	var body,
		id;

	id = req.params.id;
	Article.findOne({
		'_id': id
	}, function(err, article) {
		if (err) return next(err);
		article.remove(function(err) {
			if (err) return next(err);
			res.redirect('/');
		})
	});
});

router.post('/save', function(req, res, next) {
	var body,
		jsVersion,
		htmlContent,
		jsContent,
		article;

	body = req.body;
	jsVersion = body.jsVersion || '1.5';
	jsContent = body.jsContent || '';
	htmlContent = body.htmlContent || '';
	article = new Article({
		jsVersion: jsVersion,
		jsContent: jsContent,
		htmlContent: htmlContent
	});
	article.save(function(err, art) {
		if (err) return next(err);
		res.json({url:art._id});
	});
});
