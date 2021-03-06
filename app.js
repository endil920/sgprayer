var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var models = require('./models/weeklyRequests');

var Group = models.Group;
var FullRequest = models.FullRequest;
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
    var fullRequest = new FullRequest({
      name: name,
      date: date,
      weekNumber: weekNumber,
      group: group,
      message: message});

    fullRequest.save(function(err) {
      if (err) {
        console.log('there was an error')
        res.end(false);
      }
      res.send(fullRequest);
    });
  });
});

app.post('/prayfor/:id', function(req, res) {
  FullRequest.findById(req.params.id, function(err, fullRequest) {
    fullRequest.prayedCount += 1;
    fullRequest.save();
    res.end();
  });

});

app.get('/requestsThisWeek/:group/year/:year/month/:month/day/:day', Requests.thisWeek);
app.get('/requestsLastWeek/:group/year/:year/month/:month/day/:day', Requests.lastWeek);
app.get('/summary', function(req, res) {
  res.redirect('/');
});
app.get('/update', function(req, res) {
  res.redirect('/');
});
app.get('/groups/:group', function(req, res) {
  var groupName = req.params.group;
  Group.find({name: groupName}, function(err, group) {
    console.log(group);
    if (group.length > 0) {
      console.log('found the group');
      res.send(true);
    } else {
      console.log('no group exists');
      res.end(false);
    }
  });
});

app.get('/:group/*', function(req, res) {
  res.redirect('/' + group);
});
app.get('/:group', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {

  socket.on('join', function(room) {
    roomMap[socket.id] = room;
    socket.join(room);
  });

  socket.on('requestSubmit', function(data) {
    var room = roomMap[socket.id];
        io.in(room).emit('addRequest', data);
  });

  socket.on('prayFor', function(id) {
    var room = roomMap[socket.id];
    console.log(id);
    io.in(room).emit('prayFor', id);
  });

  socket.on('leave', function(room) {
    roomMap[socket.id] = undefined;
    socket.leave(room);
  });

});
var port = process.env.PORT || 3001;
http.listen(port);

console.log("listening on port " + port);
