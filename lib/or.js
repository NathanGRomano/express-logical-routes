var async = require('async')

module.exports = or;

function or () {
	return function (req, res, next) {
		next();
	}
}
