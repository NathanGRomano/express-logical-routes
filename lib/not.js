var every = require('./fn')('every');

module.exports = function (fn) {
	return every(function (req, res, next) {
		fn(req, res, function (result) {
			next(!result);
		});
	});
};
