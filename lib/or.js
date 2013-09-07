/*
 * or ()
 *
 * This method produces a middleware to assert that one of the functions
 * will be true
 *
 * Each argument should be a function and each function should perform
 * a test and return true or false or call next(new Error('...'))
 * If the results of all the passed functions is true, then the next 
 * middleware will be called.
 *
 */

var async = require('async')

module.exports = or;

function or () {
	var args = Array.prototype.slice.call(arguments), filtered = []

	args.forEach(function (fn) {
		if (typeof fn == 'function')
			filtered.push(fn);
	});

	return function (req, res, next) {
		var errors = [];
		async.some(filtered, function (fn, cb) {
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
				return next(new Error())
			}
			next();
		});
	}
}
