var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.engine('.html', require('jade').renderFile);

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
