/* Modules */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var model = require('./js/model.js');
var c = require('./config.json');

var port = process.env.PORT || c.port;

/* Configuration */
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var contentProvider = model.contentProvider;

/* API */
app.get('/api/content', function(req, res){
  contentProvider.getContent(Date.now(), function(err, currentContent, upcomingContent, missingContent) {
    if(err){
      res.json({success: false});
    } else {
      var result = {
        success         : true, 
        currentContent  : currentContent,
        upcomingContent : upcomingContent, 
        missingContent  : missingContent
      };
      res.json(result);
    }  
  });
});

/* Router */
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/demo', function(req, res){
  //Create fake content for demoing purposes
});
/* Application */
http.listen(port, function(){
  console.log('listening on localhost:' + port);
});
