var assert = require('assert')
	, request = require('supertest')
  , express = require('express')
	, fn = require('../.').fn 


describe('fn()', function () {
	describe('when instantiating with "some"', function () {
		it('should create a new function to be used as middleware', function (done) {
			var middleware = fn('some');	
			done();
		});
	});
});


describe('given an attached succeed() method to the middleware() instance', function () {

	describe('when middleware() is invoked', function () {
			
		var app = express();
		app.get('/test', fn('some')(isTrue, isFalse).succeed(succeed).then(done))

		it('the the succeed() method should be triggered', function (done) {

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

describe('given an attached failure() method to the middleware() instance', function () {

	describe('when middleware() is invoked', function () {

		var app = express();
		app.get('/test', fn('some')(isFalse, isFalse).failure(failure).then(done))

		it('then the failure() method should be triggered', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err);
					assert.equal(res.body.ok, false);
					done();
				});

		});

	});

});

describe('given an attached then() method to the middleware() instance', function ( ){

	describe('when middleware() is invoked', function () {

		var app = express();
		app.get('/test', fn('some')(isFalse, isFalse).failure(failure).then(done))

		it('then the done() method should triggered', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err)
					assert.equal(res.body.ok, false)
					done()
				});

		});

	});

});

function succeed (req, res, next) {
	req.ok = true;
	next()
}

function failure (req, res, next) {
	req.ok = false;
	next()
}

function done (req, res) {
	res.json({ok:req.ok});
}

function isTrue (req, res, next) {
	next(true);
}

function isFalse (req, res, next) {
	next(false);
}
