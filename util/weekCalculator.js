var moment = require('moment');

/* date is any date, beginning day is ISO format, from 1 to 7*/
function subtractorFunc(d, b) {return d + (d < b ? 6 : - 1)}
function compute(date, basis) {
	var startDay = getStartOfWeek(date, basis);
	return startDay.get('year') * 100 + startDay.isoWeek();
}
function subtract(date, beginningDay, weeks) {
	var newDate = moment(date).subtract(weeks, 'week');
	return compute(newDate, beginningDay);
}
function getStartOfWeek(date, basis) {
	var dayOfWeek = moment(date).isoWeekday();
	var subtractor = subtractorFunc(dayOfWeek, basis);
	return moment(date).add(-1 * subtractor, 'days').hours(9).minutes(0).seconds(0);
}
function getStartOfWeekDate(date, basis) {
	return getStartOfWeek(date, basis).add(basis - 1, 'days').toDate();
}
function getEndOfWeekDate(date, basis) {
	return getStartOfWeek(date, basis).add(basis + 5, 'days').toDate();
}
module.exports.compute = compute;
module.exports.subtract = subtract;
module.exports.getStartOfWeek = getStartOfWeekDate;
module.exports.getEndOfWeek = getEndOfWeekDate;
