/* Modules */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var model = require('./js/model.js');
var c = require('./config.json');

var port = process.env.PORT || c.port;
var findInterval = 30 * 60 * 1000;
var purgeInterval = (1 * 3 * 1000);

/* Configuration */
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var contentProvider = new model.ContentProvider;

/* API */
app.get('/api/content', function(req, res){
  contentProvider.getContent(Date.now(), function(err, currentContent, upcomingContent, missedContent) {
    if(err){
      res.json({success: false});
    } else {
      var result = {
        success         : true, 
        currentContent  : currentContent,
        upcomingContent : upcomingContent, 
        missedContent  : missedContent
      };
      res.json(result);
    }  
  });
});

/* Router */
app.get('/', function(req, res){
  res.sendfile('index.html');
});

//Create fake content for demoing purposes
//TODO - to be removed
app.get('/demo', function(req, res){
  var startDate = new Date(Date.now());
  var endDate = new Date(Date.now());
  //startDate.setHours(startDate.getHours() + 2);
  endDate.setHours(endDate.getHours() + 1);
  var content = {
    title    : "Steelers @ Broncos",
    start    : startDate,
    end      : endDate,
    networks : ["CBS"],
    streams  : [],
    hashtags : ["#PITatDEN", "#Broncos", "#Steelers"],
    image    : "demo/1.jpg"
  };
  
  contentProvider.createContent(content, function(err){
    if(err){
      res.json({success: false, err: err});
    } else {
      res.json({success: true});
    }
  });
});

app.get('*', function(req, res){
  res.redirect('/')
});

/* Application */
//setInterval(findContent, findInterval);
setInterval(purgeContent, purgeInterval);

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});

/* Helper Functions */

// Find new content
function findContent(){
  
}

// Purge old content
function purgeContent(){
  contentProvider.purgeContent(function(err) {});
}
