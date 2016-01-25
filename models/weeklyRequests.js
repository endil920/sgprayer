var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Schema = mongoose.Schema;

var requestSchema = new Schema({
	name: String,
    date: Date,
    message: String});

var groupSchema = new Schema({
  meetingDay: Number,
    name: String
});

groupSchema.plugin(findOrCreate);
var Group = mongoose.model('Group', groupSchema);

var weeklyRequestsSchema = new Schema({
	weekNumber: Number,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'}, 
    requests: [requestSchema]
});

weeklyRequestsSchema.plugin(findOrCreate);
var WeeklyRequests = mongoose.model('WeeklyRequests', weeklyRequestsSchema);

var fullRequestSchema = new Schema({
    name: String,
    date: Date,
    weekNumber: Number,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'}, 
    message: String
});
var FullRequest = mongoose.model('FullRequest', fullRequestSchema);

module.exports.WeeklyRequests = WeeklyRequests;
module.exports.Group = Group;
module.exports.FullRequest = FullRequest;
