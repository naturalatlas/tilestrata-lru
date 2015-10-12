var SyncCache = require('active-cache/sync');
var filesizeParser = require('filesize-parser');

function key(req) {
	return req.z+','+req.x+','+req.y+','+req.layer+','+req.filename;
}

module.exports = function(opts) {
	opts = opts || {};

	var lruopts = {max: 6};
	if (typeof opts.size === 'string') {
		lruopts.max = filesizeParser(opts.size);
		lruopts.length = function(item){ return item.buffer.length; };
	} else if (typeof opts.size === 'number') {
		lruopts.max = opts.size;
	}

	lruopts.maxAge = (opts.ttl || 15) * 1000;
	lruopts.interval = opts.clearInterval || 5000;
	var cache = new SyncCache(lruopts);

	return {
		name: 'lru',
		get: function(server, req, callback) {
			var item = cache.get(key(req));
			if (item) return callback(null, item.buffer, item.headers);
			callback();
		},
		set: function(server, req, buffer, headers, callback) {
			cache.set(key(req), {buffer: buffer, headers: headers});
			callback();
		}
	};
};
