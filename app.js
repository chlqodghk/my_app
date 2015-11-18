var express = require('express');

var app = express();

app.get('/', function(req, res){
  res.send('Hello World1!');
});

app.listen(3000, function(){
  console.log('Server On!');
});
