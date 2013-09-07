var assert = require('assert')
	, request = require('supertest')
	, express = require('express')
	, or = require('../.').or 


describe('the or() method', function () {

	describe('when invoked with middleware isTrue, and isTrue', function () {

		app = express();
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

});

function isTrue (req, res, next) {
	next(true);
}

function done (err, req, res) {
	if (err instanceof Error) return res.json({ok:false, error:err})
	req.json({ok:true});
}
