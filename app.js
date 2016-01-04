var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var models = require('./models/weeklyRequests');
var WeeklyRequests = models.WeeklyRequests;
var Group = models.Group;
var WeekCalculator = require('./util/weekCalculator.js');
mongoose.connect('mongodb://localhost/test');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.engine('.html', require('jade').renderFile);

app.get('/main', function(req, res) {
  res.sendFile(__dirname + '/public/views/main.html');
});
app.post('/addgroup', function(req, res) {
	var groupName = req.body.group;
	var meetingDay = req.body.meetingDay;
	Group.find({name: groupName}, function(err, group) {
		if (!group) {
			var group = new Group({meetingDay: meetingDay, name: groupName});
			group.save(function(err) {
				if (err) throw err;
				res.send('created group successfully');
			});
		} else {
			res.send('group already exists');
		} 
	});
});
app.post('/addrequest/:group', function(req, res) {
	var groupName = req.params.group;
	var name = req.body.name;
	var message = req.body.message;
	var date = new Date();
	Group.findOrCreate({name: groupName}, function(err, group) {
		console.log('this is the group: ' + group);
		WeeklyRequests.findOrCreate({group: group, weekNumber: -1}, function(err, requestsList) {
			console.log('the requests list is ' + requestsList);
			requestsList.requests.push({name: name, message: message, date: date});
			requestsList.save(function(err) {
				if (err) throw err;
				console.log('saved new request for ' + name + ' successfully');
			});
			res.end();
		});
	});
});
app.get('/requestsPreviousWeek/:group', function(req, res) {
	var groupName = req.params.group;
	var date = req.params.date || new Date();
	Group.findOne({name: groupName}, function(err, group) {
		if (group) {
			var weekBasis = group.meetingDay || 0;
			var weekNumber = WeekCalculator.compute(date, weekBasis);
			WeeklyRequests.findOne({group: group, weekNumber: weekNumber}, function(err, weeklyRequests) {
				var requestsList = weeklyRequests.requests;
				var result = requestsList.map(function(weeklyRequest) {
					return {name: weeklyRequest.name, message: weeklyRequest.message};
				});
				res.send(result);
			});
		} else {
			res.send(false);
		}
	});
});
app.get('/testget/:group', function(req, res) {
	var group = req.params.group;
	WeeklyRequests.find({group: group, weekNumber: -1}, function(err, data) {
		res.send(data);
	});
});

app.get('/views/update', function(req, res) {
	res.sendFile(__dirname + '/public/views/add.html');
});
app.get('/views/summary', function(req, res) {
	res.sendFile(__dirname + '/public/views/summary.html');
});

app.get('/:group', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/request/:group', function(req, res) {
	//TODO: add to group collection
	//TODO: trigger socket event for all others in the group
	console.log(req.body);
});


app.listen(3000);
console.log("listening on port 3000");
