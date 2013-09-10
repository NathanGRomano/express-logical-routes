/*
 * fn
 *
 * This function, when invoked, given a name of an async function, will 
 * produce a new function that can be used as middleware for express
 *
 */
 
var async = require('async')

module.exports = function (o) {
	if (typeof async[o] !== 'function') throw new Error('"o" must be the name of function supported by async');

	return function () {
		var args = Array.prototype.slice.call(arguments), filtered = []

		args.forEach(function (fn) {
			if (typeof fn == 'function')
				filtered.push(fn);
		});

		var op = function (req, res, next) {
			var errors = [];
			async[o](filtered, function (fn, cb) {
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
					if (op._done) return op._done(new Error(), req, res, next)
					else return next(new Error())
					return;
				}
				if (op._succeed) op._succeed(null, req, res, next)
				else if (op._done) op._done(null, req, res, next)
				else next()
			});
		};
	
		/*
		 * TODO make it push "fn" onto a stack and call that in series
		 */

		op.then = function (fn) {
			this._done = function (err, req, res, next) {
				fn(err, req, res, next);
			};
			return this;
		};

		op.succeed = function (fn) {
			this._succeed = function (err, req, res, next) {
				fn(err, res, res, next);
			};
			return this;
		};

		return op;
	};
}
