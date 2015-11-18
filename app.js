var express = require('express');

var app = express();

var path = require('path');
var mongoose = require('mongoose');

/*
mongoose.connect("mongodb://<dbuser>:<dbpassword>");
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});
*/
/*
app.get('/', function(req, res){
  res.send('Hello World1!');
});
*/
app.set("view engine", 'ejs');
//app.use(express.static(__dirname + '/public'));
console.log(__dirname);
/*
app.get('/', function(req, res){
  res.render('my_first_ejs');
});
*/

var data={count:0};

app.get('/', function (req, res) {
  data.count++;
  res.render('my_first_ejs', data);
});

app.get('/reset', function (req, res) {
  data.count=0;
  res.render('my_first_ejs', data);
});

app.get('/set/count', function (req, res) {
  if(req.query.count){
    data.count=req.query.count;
  }
  res.render('my_first_ejs', data);
});

app.get('/set/:num', function (req, res) {

  data.count=req.params.num;

  res.render('my_first_ejs', data);
});

app.listen(3000, function(){
  console.log('Server On!');
});
