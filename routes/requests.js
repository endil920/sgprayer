var moment = require('moment');
var models = require('../models/weeklyRequests');
var Group = models.Group;
var WeekCalculator = require('../util/weekCalculator.js');
var WeeklyRequests = models.WeeklyRequests;

var baseFunc = function(dateFunc) {
	return function(req, res) {

		var groupName = req.params.group;
		group = groupName;

		var year = req.params.year;
		var month = req.params.month;
		var day = req.params.day;
		var date = dateFunc(moment({y: year, M: month, d: day}).toDate());

		Group.findOne({name: groupName}, function(err, group) {
			if (group) {

				var weekBasis = group.meetingDay || 1;
				var weekNumber = WeekCalculator.compute(date, weekBasis);
				WeeklyRequests.findOrCreate({group: group, weekNumber: weekNumber}, function(err, weeklyRequests) {
					var requestsList = weeklyRequests.requests;
					var simpleRequestsList = requestsList.map(function(weeklyRequest) {
						return {name: weeklyRequest.name, message: weeklyRequest.message};
					});

					var startDate = WeekCalculator.getStartOfWeek(date, weekBasis);
					var endDate = WeekCalculator.getEndOfWeek(date, weekBasis);

					res.send({requests: simpleRequestsList, startDate: startDate, endDate: endDate});
				});
			} else {
				res.send(false);
			}
		});

	};
}
var thisWeek = baseFunc(function(d) {return d});
var lastWeek = baseFunc(WeekCalculator.previousWeek);
module.exports.thisWeek = thisWeek;
module.exports.lastWeek = lastWeek;
