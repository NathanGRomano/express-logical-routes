var assert = require('assert')
	, request = require('supertest')
	, express = require('express')
	, or = require('../.').or 


describe('the or() method', function () {

	describe('when invoked with middleware isTrue, and isTrue', function () {

		var app = express();
		app.get('/test', or(isTrue, isTrue).then(done));

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err);
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isTrue, and isFalse', function () {

		var app = express();
		app.get('/test', or(isTrue, isFalse).then(done));

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err)
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isFalse, and isTrue', function () {

		var app = express();
		app.get('/test', or(isFalse, isTrue).then(done));

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err);
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isFalse, and isFalse', function () {

		var app = express();
		app.get('/test', or(isFalse, isFalse), done );

		it('then should invoke our last handler with the value of false', function (done) {

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

describe('the return function of or().then(fn)', function () {
	
	describe('when being invoked', function () {

		var app = express();
		app.get('/test', or(isFalse, isFalse).then(done) );

		it('fn() should be invoked', function (done) {

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


function isTrue (req, res, next) {
	next(true);
}

function isFalse (req, res, next) {
	next(false);
}

function done (req, res) {
	res.json({ok:req.errors ? false : true});
}

