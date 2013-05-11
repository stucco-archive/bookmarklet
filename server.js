/* global require:true, console:true, process:true, __dirname:true */
'use strict';

var express  = require('express')
  , https    = require('https')
  , http     = require('http')
  , csv      = require('csv')
  , json2csv = require('json2csv')
  , fs       = require('fs')
  , redis    = require('redis')
  , redisClient
  , dataDir  = 'userdata/';


var output = 'csv'; // 'csv' or 'redis'

// setup for redis
if (output === 'redis') {
  redisClient = redis.createClient();

  // redis connection test
  redisClient.on('connect', function() {
    console.log('Connected to redis.');
  });
}

// CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Length, Content-Type, Date');
  next();
}

// Init
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));

// OPTIONS
// TODO see if I can remove this
app.options('/', function(req, res) {
  res.send(200);
});

// POST
app.post('/', function handlePost(req, res) {
  var d = req.body;
  saveForm([d.type, d.userid].join('-')+'.csv', d.form);
  res.send(200);
})

// POST (error)
app.post('/error', function handlePost(req, res) {
  var d = req.body;
  console.log(d.msg);
  res.send(200);
})

// Process form
var saveForm = function saveForm(name, json) {
  var params = { 
    data: [json], 
    fields: Object.keys(json) 
  };
  json2csv(params, function(err, csvData) {
    if (err) throw err;
    csv().from(csvData).to(dataDir+name);
    console.log('csv saved, %s', name);
  })
}

// SSL Options
var sslOptions = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
};

http.createServer(app).listen(80, function (err) {
  if (!err) {
    console.log('Listening on port 80');
  }
});
https.createServer(sslOptions, app).listen(443, function (err) {
  if (!err) {
    console.log('Listening on port 443');
  }
});

process.on('uncaughtException', function (err) {
  if (err.code === 'EACCES') {
    console.log('Unable to start server - you must start as root user.');
  }
  else {
    console.log(err);
  }
  process.exit(1);
});
