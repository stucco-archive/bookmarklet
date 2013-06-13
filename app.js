/* global require:true, console:true, process:true, __dirname:true */
'use strict'

var express     = require('express')
  , https       = require('https')
  , http        = require('http')
  , redis       = require('redis')
  , host        = 'local' // 'appfog' or 'local'
  , fs          = require('fs')
  , sslOptions  = {
      key: fs.readFileSync('ssl/server.key'),
      cert: fs.readFileSync('ssl/server.crt')
    }

var redisClient = redis.createClient()
  .on('connect', function() {
    console.log('Connected to redis.')
  })

var app = express()
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser())
  .use(allowCrossDomain)
  .post('/', handlePost)
  .options('/', sendOK)

function handlePost(req, res) {
  var d = req.body
  d.postId = (+new Date()).toString(36)
  d.timestamp = (new Date()).getTime()
  save(d)
  res.send(200)
}
function save(d) {
  redisClient.hmset(d.postId, d)
  console.log('saved to redis: ' + d.postId)
}
function sendOK(req, res) {
  res.send(200);
}
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Length, Content-Type, Date')
  next()
}

if( host === 'appfog' ) {
  http.createServer(app).listen(process.env.VCAP_APP_PORT || 3000, function (err) {
    if (!err) console.log('Listening on port ' + process.env.VCAP_APP_PORT || 3000)
  })
}
if( host === 'local' ){
  http.createServer(app).listen(80, function (err) {
    if (!err) console.log('Listening on port 80')
  })
  https.createServer(sslOptions, app).listen(443, function (err) {
    if (!err) console.log('Listening on port 443')
  })
}

process.on('uncaughtException', function (err) {
  if (err.code === 'EACCES') 
    console.log('Unable to start server - you must start as root user.')
  else 
    console.log(err)
  process.exit(1)
})
