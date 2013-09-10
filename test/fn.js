var assert = require('assert')
	, request = require('supertest')
  , express = require('express')
	, fn = require('../.').fn 

var middleware;

describe('fn()', function () {
	describe('when instantiating with "some"', function () {
		it('should create a new function to be used as middleware', function (done) {
			middleware = fn('some');	
			done();
		});
	});
});


describe('given an attached succeed() method to the middleware() instance', function () {

	describe('when middleware() is invoked', function () {

		it('the the succeed() method should be triggered', function (done) {

			middleware(isTrue, isFalse).succeed(function (err, req, res, next) {
				res.json({ok:true});
			});

			var app = express();
			app.get('/test', middleware);

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err);
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

});

function isTrue (req, res, next) {
	next(true);
}

function isFalse (req, res, next) {
	next(false);
}
