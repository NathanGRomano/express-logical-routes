var async = require('async');

module.exports = and;

function and () {
	var and = function (req, res, next) {
		next(new Error('needs implemented!'));
	}
	and.then = function () {
		return this;	
	}
	return and;
}
