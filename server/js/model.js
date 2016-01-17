var mongoose = require('mongoose');

//figure out how to get uri string from server.js
var uriString = process.env.MONGOLAB_URI || 'mongodb://localhost/telly'
var connection = mongoose.createConnection(uriString);

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/* Schemas */
var contentSchema = new Schema({
  title : String,
  start: Date,
  end: Date,
  networks : [String],
  streams : [String],
  hashtags : [String],
  image : String
});

/* Content */
var Content = connection.model('Content', contentSchema);
var ContentProvider = function(){};

ContentProvider.prototype.createContent = function(params, cb) {
  var content  = new Content({
    title    : params['title'],
    start    : params['start'],
    end      : params['end'],
    networks : params['networks'],
    streams  : params['streams'],
    hashtags : params['hashtags'],
    image    : params['image']
  });
  
  content.save(function(err){
    console.log(err);
    cb(err);
  });
};

ContentProvider.prototype.getCurrentContent = function(datetime, cb) {
  //find content where end > now > start
  Content.find({}).exec(function(err, currentContent) {
		if(err){
			cb(err);
		} else {
			//find content where start > now  
			Content.find({}).exec(function(err, upcomingContent) {
				if(err){
					cb(err);
				} else {
					//find content where now > end 
					Content.find({}).exec(function(err, missedContent) {
						cb(err, currentContent, upcomingContent, missedContent);
					});
				}
			});
		}
	});
};

ContentProvider.prototype.purgeContent = function(cb) {
	//delete things that have ended 12 hours ago
};

exports.ContentProvider = ContentProvider;

/* Helper Functions */
function handleError(err){
	//Take errors and return human readable messages
}
