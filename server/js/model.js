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

// Create and save new content
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
    return cb(err);
  });
};

// Get current, upcoming, and missed content
ContentProvider.prototype.getContent = function(datetime, cb) {
  Content.find({ '$and': [{ end: { '$gt': datetime } },{ start: { '$lt': datetime } } ] }).exec(function(err, currentContent) {
		if(err) return cb(err)
    else {
			Content.find({ start: { '$gt': datetime }}).exec(function(err, upcomingContent) {
				if(err) return cb(err)
        else {
					Content.find({ end: { '$lt': datetime } }).exec(function(err, missedContent) {
						return cb(err, currentContent, upcomingContent, missedContent);
					});
				}
			});
		}
	});
};

// Purge content older than 12 hours
ContentProvider.prototype.purgeContent = function(cb) {
  console.log("Purging Content");
  Content.remove({ end: { '$lt': addHours(Date.now(), -12) } }, function(err){
    if (err) return handleError(err);
    return cb(null);
  });
  console.log("Purged Content");
};

exports.ContentProvider = ContentProvider;

/* Helper Functions */

// Convert errors into human readable messages
function handleError(err){
  return err;
}

// Add hours
function addHours(time, hours){
  var date = new Date(time);
  return date.setHours(date.getHours() + hours);
}
