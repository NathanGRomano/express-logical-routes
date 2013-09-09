/*
 * and ()
 *
 * This method produces a middleware to assert that each of the functions
 * will be true
 *
 * Each argument should be a function and each function should perform
 * a test and return true or false or call next(new Error('...'))
 * If the results of all the passed functions is true, then the next 
 * middleware will be called.
 *
 */

var async = require('async');

module.exports = and;

function and () {
	var args = Array.prototype.slice.call(arguments), filtered = []

	args.forEach(function (fn) {
		if (typeof fn == 'function')
			filtered.push(fn);
	});

	var and = function (req, res, next) {
		var errors = [];
		async.every(filtered, function (fn, cb) {
			fn(req, res, function (err) {
				if (err === false || err instanceof Error) {
					errors.push(err);
					return cb(false);
				}
				cb(true);
			});
		}, function (result) {
			if (!result) {
				req.errors = errors;
				if (and._done) return and._done(new Error(), req, res, next)
				else return next(new Error())
			}
			if (and._done) and._done(null, req, res, next)
			else next()
		});
	};

	and.then = function (fn) {
		this._done = function (err, req, res, next) {
			fn(err, req, res, next);
		};
		return this;
	};

	return and;
}
