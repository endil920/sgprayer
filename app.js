var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var WeeklyRequests = require('./models/weeklyRequests');

mongoose.connect('mongodb://localhost/test');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.engine('.html', require('jade').renderFile);
app.post('/addrequest/:group', function(req, res) {
  var group = req.params.group;
  var name = req.body.name;
  var message = req.body.message;
  var date = new Date();
  WeeklyRequests.findOrCreate({group: group, weekNumber: -1}, function(err, requestsList) {
	  console.log('the requests list is ' + requestsList);
	  requestsList.requests.push({name: name, message: message, date: date});
	  requestsList.save(function(err) {
		  if (err) throw err;
		  console.log('saved new request for ' + name + ' successfully');
	  });
  });
});
app.get('/testget/:group', function(req, res) {
	var group = req.params.group;
	WeeklyRequests.find({group: group, weekNumber: -1}, function(err, data) {
		res.send(data);
	});
});

app.get('/views/update', function(req, res) {
	res.sendFile(__dirname + '/public/views/update.html');
});
app.get('/views/summary', function(req, res) {
	res.render(__dirname + '/public/views/summary.html');
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
