$(function() {

	var jsEditor,
		htmlEditor,
		jsModeSrc,
		iFrame = $('iframe'),
		ajaxConfig = {
			run: {
				url: '/run',
				type: 'POST'
			},
			save: {
				url: '/save',
				type: 'POST'
			},
			del: {
				type: 'DELETE',
				url:'/delete'
			},
			update: {
				type: 'POST',
				url:'/update'
			}

		};

	jsModeSrc = $('.js-version');
	jsEditor = ace.edit('js-editor');
	jsEditor.getSession().setMode('ace/mode/javascript');

	htmlEditor = ace.edit('html-editor');
	htmlEditor.getSession().setMode('ace/mode/html');

	$([jsEditor, htmlEditor]).each(function(idx, editor) {
		editor.setTheme('ace/theme/github');
		// editor.setOptions({
		// 	enableSnippets: true,
		// 	enableBasicAutocompletion: true
		// });
		editor.setFontSize(16);
	});

	$('.btn').on('mousedown', function(e) {
		$(this).addClass('pressed');
	}).on('mouseup', function(e) {
		$(this).removeClass('pressed');
	});

	function ajax(config) {
		var defaultConfig = {
			dataType: 'json',
			contentType: 'application/json'
		},
		finalConfig;
		finalConfig = $.extend({}, defaultConfig, config || {});
		return $.ajax(finalConfig);
	}

	function getData() {
		var jsMode,
			htmlContent,
			jsContent;

		jsMode = jsModeSrc.val();
		htmlContent = htmlEditor.getValue();
		jsContent = jsEditor.getValue();

		return {
			jsVersion: jsMode,
			htmlContent: htmlContent,
			jsContent: jsContent
		};
	}

	function validate(data) {
		if (!data.jsContent) {
			return false;
		}
		return true;
	}

	function handleUpdateAndDelete(action, data) {
		var id = (window.location.pathname || '').substr(1);
		return ajax({
			type: ajaxConfig[action].type,
			url: ajaxConfig[action].url + '/' + id,
			data: JSON.stringify(data || {})
		});
	}

	$('.run').on('click', function(e) {
		var postData = getData();
		ajax($.extend({}, ajaxConfig.run, {
			data: JSON.stringify(postData)
		})).done(function(data) {
			iFrame.attr('src', '/result.html');
		});
	});

	$('.reset').on('click', function() {
		jsEditor.setValue('');
		htmlEditor.setValue('');
		iFrame.attr('src', '');
	});

	$('.save').on('click', function() {
		var postData = getData(),
			config;

		if (!validate(postData)) {
			throw new Error('Invalid data', postData);
		}
		config = $.extend({}, ajaxConfig.save, {
			data: JSON.stringify(postData)
		});

		ajax(config).done(function(resp){
			window.location.href = '/'+resp.url;
		});
	});

	$('.header').on('click', '.update', function() {
		var postData = getData();
		if (!validate(postData)) {
			throw new Error('Invalid data', postData);
		}
		handleUpdateAndDelete('update', postData);
	});

	$('.header').on('click', '.delete', function() {
		handleUpdateAndDelete('del');
	});


});