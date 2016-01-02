var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Schema = mongoose.Schema;
var requestSchema = new Schema({
	name: String,
    date: Date,
    message: String});
var weeklyRequestsSchema = new Schema({
	weekNumber: Number,
    group: String,
    requests: [requestSchema]
});
weeklyRequestsSchema.plugin(findOrCreate);
var WeeklyRequests = mongoose.model('WeeklyRequests', weeklyRequestsSchema);

module.exports = WeeklyRequests;

