/* global require:true, console:true, process:true, __dirname:true */
'use strict'

var express     = require('express')
  , https       = require('https')
  , http        = require('http')
  , fs          = require('fs')
  , redis       = require('redis')
  , redisClient
  , dataDir     = 'userdata/'
  , host        = 'local' // 'appfog' or 'local'
  , sslOptions  = {
      key: fs.readFileSync('ssl/server.key'),
      cert: fs.readFileSync('ssl/server.crt')
    }

var app = express()
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser())
  .options('/', function(req, res) { res.send(200) })
  .post('/', function handlePost(req, res) {
    var d = req.body
    d.postId = (+new Date()).toString(36)
    d.timestamp = (new Date()).getTime()
    saveRedis(d)
    res.send(200)
  })
  .post('/error', function handlePost(req, res) {
    var d = req.body
    console.log(d.msg)
    res.send(200)
  })

var allowCrossDomain = function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Length, Content-Type, Date')
  next()
}
app.use(allowCrossDomain)

var saveRedis = function saveRedis(d) {
  redisClient.hmset(d.postId, d)
  console.log('saved to redis: ' + d.postId)
}

redisClient = redis.createClient()
redisClient.on('connect', function() {
  console.log('Connected to redis.')
})

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
