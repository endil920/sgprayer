var moment = require('moment');

/* date is any date, beginning day is ISO format, from 1 to 7*/
function subtractorFunc(d, b) {return d + (d < b ? 6 : - 1)}
var compute = function(date, beginningDay) {
	var dayOfWeek = moment(date).isoWeekday();
	var subtractor = subtractorFunc(dayOfWeek, beginningDay);
	var basisDay = moment(date).add(-1 * subtractor, 'days');

	return basisDay.get('year') * 100 + basisDay.isoWeek();
};
var subtract = function(date, beginningDay, weeks) {
	var newDate = moment(date).subtract(weeks, 'week');
	return compute(newDate, beginningDay);
};
module.exports.compute = compute;
module.exports.subtract = subtract;
