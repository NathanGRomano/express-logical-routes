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

describe('given a middleware', function () {

	var some = fn('some')
		, middleware = some(isFalse, isTrue).then(function (req, res, next) { res.json({ok:req.worked}) })

	describe('when invoked', function () {

		it('should give an undefined value because it was not set via success() or failure()', function(done) {

			var app = express()
			app.get('/test', middleware)

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, undefined);
					done();
				});
			
		});

	});

	describe('calling the middleware with no args', function () {

		it('should give us a new method and when invoked does the same thing', function (done) {

			var test = middleware()

			var app = express()
			app.get('/test', test)

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, undefined);
					done();
				});

		});

	});

	describe('calling the middleware with no args with a success() method', function () {

		it('should give us a new method and when invoked should give us a true result', function (done) {

			var test = middleware()
			test.succeed(function (req, res, next) {
				console.log('this should be called');
				req.worked = true
				next()
			})

			var app = express()
			app.get('/test', test)

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, true);
					done();
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
