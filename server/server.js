var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var sharedEvents = require('./sharedEventEmitter.js');
var downloadCourses = require('./downloadCourses.js');

/**
 * Set public folder
 */
app.use(express.static('client'));

/**
 * Start the server
 */
var port = process.env.PORT || 3000;
server.listen(port);


var fs = require('fs');
var xml2json = require('xml2json');

sharedEvents.on('download.finished', function(file) {
  var xml = fs.readFileSync(file, 'utf8');
  console.log(xml);
  var json = xml2json.toJson(xml);
  json = JSON.parse(json);
  console.log(json.catalog);
});

sharedEvents.emit('download.start');
