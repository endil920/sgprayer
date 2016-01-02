var express = require('express');
var path = require('path');
var app = express();

app.use(express.static('public'));


app.engine('.html', require('jade').renderFile);

app.get('/views/update', function(req, res) {
	res.sendFile(__dirname + '/public/views/update.html');
});
app.get('/views/summary', function(req, res) {
	res.render(__dirname + '/public/views/summary.html');
});
app.get('/:group', function(req, res) {
	console.log(req.params.group);
	res.sendFile(__dirname + '/public/index.html');
});


app.listen(3000);
console.log("listening on port 3000");
