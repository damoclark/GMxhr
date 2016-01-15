// allows using all Jquery AJAX methods in Greasemonkey
// https://gist.github.com/damoclark/f01b957797b7dd2c33d6
// https://gist.github.com/monperrus/999065
// inspired from http://ryangreenberg.com/archives/2010/03/greasemonkey_jquery.php
// works with JQuery 1.5
// (c) 2016 Damien Clark
// (c) 2011 Martin Monperrus
// (c) 2010 Ryan Greenberg
//
// Example usage with JQuery:
//   $.ajax({
//     url: '/p/',
//     xhr: function(){return new gmXhr();},
//     type: 'POST',
//     success: function(val){
//        ....
//     }
//   });

/**
 * xmlHttpRequest API wrapper for GM_xmlhttpRequest
 * 
 * @returns {gmXhr} An instance with a compatible API to xmlHttpRequest
 */
function gmXhr() {
	this.type = null;
	this.url = null;
	this.async = null;
	this.username = null;
	this.password = null;
	this.status = null;
	this.headers = {};
	this.readyState = null;
}

gmXhr.prototype.abort = function() {
		this.readyState = 0;
};

gmXhr.prototype.getAllResponseHeaders = function(name) {
	if (this.readyState!=4) return '';
	return this.responseHeaders;
};

gmXhr.prototype.getResponseHeader = function(name) {
	var regexp = new RegExp('^'+name+': (.*)$','im');
	var match = regexp.exec(this.responseHeaders);
	if (match) { return match[1]; }
	return '';
};

gmXhr.prototype.open = function(type, url, async, username, password) {
		this.type = type ? type : null;
		this.url = url ? url : null;
		this.async = async ? async : null;
		this.username = username ? username : null;
		this.password = password ? password : null;
		this.readyState = 1;
};
    
gmXhr.prototype.setRequestHeader = function(name, value) {
		this.headers[name] = value;
};

gmXhr.prototype.send = function(data) {
	this.data = data;
	var that = this;
	// http://wiki.greasespot.net/GM_xmlhttpRequest
	GM_xmlhttpRequest({
		method: this.type,
		url: this.url,
		headers: this.headers,
		data: this.data,
		onload: function(rsp) {
			// Populate wrapper object with returned data
			// including the Greasemonkey specific "responseHeaders"
			for (var k in rsp) {
				that[k] = rsp[k];
			}
			// now we call onreadystatechange
			that.onreadystatechange();
		},
		onerror: function(rsp) {
			for (var k in rsp) {
				that[k] = rsp[k];
			}
			// now we call onreadystatechange
			that.onreadystatechange();
		}
	});
};

module.exports = gmXhr ;
