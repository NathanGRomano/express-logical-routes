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

module.exports = require('./fn')('every');
