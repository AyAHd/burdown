// set up =======================
var express  = require('express');
var app      = express();                               // create our app w/ express

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://localhost:27017/burdown";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

function getData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  dbObject.collection("point").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    responseObj.json(docs);
  });
}

//Defining middleware to serve static files
app.use(express.static('public'));
app.use(express.static('app'));

// Express Path
app.get("/points", function(req, res){
  getData(res);
});
app.get("/", function(req, res){
  res = render("index");
});


// listen (start app with node server.js) ======================================
app.listen("3000", function(){
  console.log('Server up: http://localhost:3000');
});