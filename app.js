var express = require('express');

var app = express();

var path = require('path');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');

mongoose.connect(process.env.mongo_db);
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

/*
app.get('/', function(req, res){
  res.send('Hello World1!');
});
*/

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model('data', dataSchema);
Data.findOne({name:"myData"}, function(err, data){
  if(err){
    return console.log("Data ERROR:", err);
  }
  if(!data){
    Data.create({name:"myData", count:0}, function (err, data){
      if(err){
        return console.log("Data ERROR:", err);
      }
      console.log("Counter initialized : ", data);
    });
  }
});


var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});
var Post = mongoose.model('post', postSchema);



app.set("view engine", 'ejs');
//app.use(express.static(__dirname + '/public'));
console.log(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
/*
app.get('/', function(req, res){
  res.render('my_first_ejs');
});
*/

var data={count:0};

app.get('/', function (req, res) {
  //data.count++;
  setCounter(res, data.count++);
});

app.get('/reset', function (req, res) {
  setCounter(res, 0);
});

app.get('/set/count', function (req, res) {
  if(req.query.count){
    setCounter(res, req.query.count);
  }else{
    getCounter(res);
  }
});

app.get('/set/:num', function (req, res) {
  if(req.params.num){
    setCounter(res, req.params.num);
  }else{
    getCounter(res);
  }
});

function setCounter(res, num){
  console.log("setCounter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err){
      return console.log("Data ERROR:", err);
    }
    data.count=num;
    data.save(function(err){
      if(err){
        return console.log("Data ERROR:", err);
      }
      res.render('my_first_ejs', data);
    });
  });
}

function getCounter(res){
  console.log("getCounter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err){
      return console.log("Data ERROR:", err);
    }
    res.render('my_first_ejs', data);
  });
}


// set routes
app.get('/posts', function(req, res){
  Post.find({}).sort('-createdAt').exec(function(err, posts){
    if(err){
      return res.json({success:false, message:err});
    }
    //res.json({success:true, data:posts});
    res.render("posts/index", {data:posts});
  });
}); // index

app.get('/posts/new', function(req, res){
  res.render("posts/new");
});

app.post('/posts', function(req, res){
  Post.create(req.body.post, function(err, posts){
    if(err){
      return res.json({success:false, message:err});
    }
    //res.json({success:true, data:posts});
    res.redirect('/posts');
  });
}); // create

app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err){
      return res.json({success:false, message:err});
    }
    //res.json({success:true, data:post});
    res.render("posts/show", {data:post});
  });
}); // show

app.put('/posts/:id', function(req, res){
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
    if(err){
      return res.json({success:false, message:err});
    }
    res.json({success:true, message:post._id+" updated"});
  });
}); // update

app.delete('/posts/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, post){
    if(err){
      return res.json({success:false, message:err});
    }
    res.json({success:true, message:post._id+" deleted"});
  });
}); // delete





app.listen(3000, function(){
  console.log('Server On!');
});
