var assert = require('assert')
  , request = require('supertest')
	, express = require('express')
	, not = require('../.').not

describe('the not() method', function () {

	describe('when invoked with middleware isTrue', function () {

		var app = express()
		app.get('/test', not(isTrue).then(done));

		it('then should invoke our last handler and give us a false value', function (done) {

			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err)
					assert.equal(res.ok, false)
					done();
				})

		});

	});

	describe('when invoked with middleware isFalse', function () {

		var app = express()
		app.get('/test', not(isFalse).then(done));

		it('then should invoke our last handler and give us a true value', function (done) {
			
			request(app)
				.get('/test')
				.end(function (err, res) {
					if (err) return done(err)
					assert.equal(res.ok, true)
					done();
				})

		});

	});

});

function isTrue (req, res, next) { next(true) }
function isFalse (req, res, next) { next(false) }
