var sys = require('sys');
var http = require('http');
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var sharedEvents = require('./sharedEventEmitter.js');

var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
  if (err) {
    throw err;
  }
});

// Function to download file using curl
var downloadFileCurl = function(fileUrl, fileName) {

  // create an instance of writable stream
  var file = fs.createWriteStream(DOWNLOAD_DIR + fileName);
  // execute curl using child_process' spawn function
  var curl = spawn('curl', [fileUrl]);
  // add a 'data' event listener for the spawn instance
  curl.stdout.on('data', function(data) { file.write(data); });
  // add an 'end' event listener to close the writeable stream
  curl.stdout.on('end', function(data) {
    file.end();
    console.log(fileName + ' downloaded to ' + DOWNLOAD_DIR);
    sharedEvents.emit('download.finished', DOWNLOAD_DIR + fileName);
  });
  // when the spawn child process exits, check if there were any errors and close the writeable stream
  curl.on('exit', function(code) {
    if (code !== 0) {
      console.log('Download failed: ' + code);
    }
  });
};

//var downloadfile = 'http://orqa.berkeley.edu/CourseService/Bulletin.svc/API/GetCatalog?pageStart=1&rowLimit=30000';
var downloadfile = 'http://orqa.berkeley.edu/CourseService/Bulletin.svc/API/GetCatalog?pageStart=1&rowLimit=10';

sharedEvents.on('download.start', function() {
  downloadFileCurl(downloadfile, 'courses.xml');
});