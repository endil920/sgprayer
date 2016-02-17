var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Schema = mongoose.Schema;

var groupSchema = new Schema({
  meetingDay: Number,
    name: String
});
groupSchema.plugin(findOrCreate);
var Group = mongoose.model('Group', groupSchema);

var fullRequestSchema = new Schema({
    name: String,
    date: Date,
    weekNumber: Number,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'}, 
    message: String,
    prayedCount: {type: Number, default: 0}
});
var FullRequest = mongoose.model('FullRequest', fullRequestSchema);

module.exports.Group = Group;
module.exports.FullRequest = FullRequest;
