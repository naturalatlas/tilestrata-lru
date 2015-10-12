var TileServer = require('tilestrata').TileServer;
var TileRequest = require('tilestrata').TileRequest;
var lru = require('../index.js');
var assert = require('chai').assert;

describe('Cache Implementation "lru"', function() {
	it('should set name', function() {
		assert.equal(lru().name, 'lru');
	});
	it('should allow filesize strings', function(done) {
		var cache = lru({size: '10kb'});
		var buffer = new Buffer(1024*20);
		var headers = {};
		var req = TileRequest.parse('/layer/3/1/2/tile');
		cache.set(null, req, buffer, headers, function(err) {
			cache.get(null, req, function(err, buffer, headers) {
				if (err) throw err;
				// too large to fit in lru
				assert.isUndefined(buffer, 'No buffer');
				assert.isUndefined(headers, 'No headers');
				done();
			});
		});
	});
	it('should should allow counts', function(done) {
		var cache = lru({size: 1});
		var buffer = new Buffer(1024*20);
		var headers = {};
		var req = TileRequest.parse('/layer/3/1/2/tile');
		cache.set(null, req, buffer, headers, function(err) {
			cache.set(null, TileRequest.parse('/layer/5/4/2/tile'), new Buffer(1), {}, function() {});
			setTimeout(function() {
				cache.get(null, req, function(err, buffer, headers) {
					if (err) throw err;
					// should have been bumped out of cache
					assert.isUndefined(buffer, 'No buffer');
					assert.isUndefined(headers, 'No headers');
					done();
				});
			});
		});
	});
	it('should return hits', function(done) {
		var cache = lru({size: 1, ttl: 2});
		var buffer = new Buffer(1024*20);
		var headers = {};
		var req = TileRequest.parse('/layer/3/1/2/tile');
		cache.set(null, req, buffer, headers, function(err) {
			setTimeout(function() {
				cache.get(null, req, function(err, _buffer, _headers) {
					if (err) throw err;
					assert.equal(_buffer, buffer);
					assert.equal(_headers, headers);
					done();
				});
			});
		});
	});
	it('should not return hits for other files/layers', function(done) {
		var cache = lru({size: 1, ttl: 2});
		var buffer = new Buffer(1024*20);
		var headers = {};
		var req = TileRequest.parse('/layer/3/1/2/tile');
		cache.set(null, req, buffer, headers, function(err) {
			setTimeout(function() {
				cache.get(null, TileRequest.parse('/layer2/3/1/2/tile'), function(err, buffer, headers) {
					if (err) throw err;
					assert.isUndefined(buffer, 'No buffer');
					assert.isUndefined(headers, 'No headers');
					done();
				});
			});
		});
	});
	it('should have items fall out of cache', function(done) {
		var cache = lru({size: 1, ttl: 0.1});
		var buffer = new Buffer(1024*20);
		var headers = {};
		var req = TileRequest.parse('/layer/3/1/2/tile');
		cache.set(null, req, buffer, headers, function(err) {
			setTimeout(function() {
				cache.get(null, req, function(err, buffer, headers) {
					if (err) throw err;
					// should have fallen out of cache
					assert.isUndefined(buffer, 'No buffer');
					assert.isUndefined(headers, 'No headers');
					done();
				});
			}, 200);
		});
	});
});
