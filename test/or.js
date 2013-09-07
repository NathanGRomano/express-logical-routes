var assert = require('assert')
	, request = require('supertest')
	, express = require('express')
	, or = require('../.').or 


describe('the or() method', function () {

	describe('when invoked with middleware isTrue, and isTrue', function () {

		var app = express();
		app.get('/test', or(isTrue, isTrue), done);

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isTrue, and isFalse', function () {

		var app = express();
		app.get('/test', or(isTrue, isFalse), done);

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isFalse, and isTrue', function () {

		var app = express();
		app.get('/test', or(isFalse, isTrue), done);

		it('then should invoke our last handler with the value of true', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					assert.equal(res.body.ok, true);
					done();
				});

		});

	});

	describe('when invoked with middleware isFalse, and isFalse', function () {

		var app = express();
		app.get('/test', or(isFalse, isFalse), function (err, req, res, next) { done(err, res, res); } );

		it('then should invoke our last handler with the value of false', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
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

function done (err, req, res) {
	if (err instanceof Error) {
		return res.json({ok:false, error:err})
	}
	req.json({ok:true});
}

