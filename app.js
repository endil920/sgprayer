var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var models = require('./models/weeklyRequests');
var WeeklyRequests = models.WeeklyRequests;
var Group = models.Group;
var WeekCalculator = require('./util/weekCalculator.js');
var config = require('./config/config.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var roomMap = {};
var moment = require('moment');
var Requests = require('./routes/requests.js');
mongoose.connect(config.database);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.engine('.html', require('jade').renderFile);


var group; 

app.get('/main', function(req, res) {
	res.sendFile(__dirname + '/public/views/main.html');
});
app.post('/addgroup', function(req, res) {
	var groupName = req.body.group;
	var meetingDay = req.body.meetingDay;
	console.log("the proposed meeting day is " + meetingDay);
	Group.findOne({name: groupName}, function(err, group) {
		if (!group) {

			var group = new Group({meetingDay: meetingDay, name: groupName});
			group.save(function(err) {
				if (err) throw err;
				res.send('created group successfully');
			});
		} else {
			res.send(false);
		} 
	});
});
app.post('/addrequest/:group', function(req, res) {
	var groupName = req.params.group;
	var name = req.body.name;
	var message = req.body.message;
	var date = new Date();
	Group.findOrCreate({name: groupName}, function(err, group) {

		var weekNumber = WeekCalculator.compute(new Date(), group.meetingDay);
		WeeklyRequests.findOrCreate({group: group, weekNumber: weekNumber}, function(err, requestsList) {

			requestsList.requests.push({name: name, message: message, date: date});
			requestsList.save(function(err) {
				if (err) throw err;

			});
			res.end();
		});
	});
});

app.get('/requestsThisWeek/:group/year/:year/month/:month/day/:day', Requests.thisWeek);
app.get('/requestsLastWeek/:group/year/:year/month/:month/day/:day', Requests.lastWeek);
app.get('/summary', function(req, res) {
	res.redirect('/');
}
app.get('/update', function(req, res) {
	res.redirect('/');
}
app.get('/:group/*', function(req, res) {
		  res.redirect('/' + req.params.group);
		  });
		  app.get('/:group', function(req, res) {
		  res.sendFile(__dirname + '/public/index.html');
		  });
		  io.on('connection', function(socket) {

		  socket.on('requestSubmit', function(data) {
		  var room = roomMap[socket.id];
		  console.log(room);
		  console.log(roomMap);
		  console.log('and this socket ID is ' + socket.id);
		  socket.broadcast.to(room).emit('addRequest', data);	
		  });
		  socket.on('join', function(room) {
		  console.log(socket.id + ' is joining ' + room);
		  roomMap[socket.id] = room;
		  socket.join(room);
		  });
		  socket.on('leave', function(room) {
		  console.log(socket.id + ' is leaving ' + room);
		  roomMap[socket.id] = undefined;
		  socket.leave(room);
		  });

		  });
		  var port = process.env.PORT || 3000;
		  http.listen(port);

		  console.log("listening on port " + port);
