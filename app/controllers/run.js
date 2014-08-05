var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    ejs = require('ejs');


module.exports = function(app) {
    var viewsDir = app.get('views');
    app.use('/', router);
    router.post('/run', function(req, res, next) {
        var body,
            jsVersion,
            htmlContent,
            jsContent;

        body = req.body;
        jsVersion = body.jsVersion || '1.5';
        jsContent = body.jsContent || '';
        htmlContent = body.htmlContent || '';


        fs.readFile(viewsDir + '/template.ejs','utf8', function(err, data) {
            if (err) return next(err);
            var str = ejs.render(data,{
                jsVersion: jsVersion,
                htmlContent:htmlContent,
                jsContent:jsContent
            });
            fs.writeFileSync('public/result.html',str);
            res.json({resp:200});
        });


    });
};