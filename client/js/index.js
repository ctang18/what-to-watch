$(document).ready(function() { 
  getContent();
});

function getContent(){
  $.get('api/content')
    .done(function (result) {
      if(result.success){
        $('#currentContent').html(renderCurrent(result.currentContent));
        $('#upcomingContent').html(renderCurrent(result.upcomingContent));
        $('#missedContent').html(renderCurrent(result.missedContent));
      } else {
        console.log("GET request failed");
      }
    })
    .fail(function(){
      console.log("GET request failed");
    });
}

function renderCurrent(contents){
  var contentHTML = '';
  
  for(i = 0; i < contents.length; i++){
    contentHTML += '<div class="content">'
    contentHTML += '<div class="content-info">';
    contentHTML += '<div class="content-title">' + contents[i].title + '</div><br />';
    contents[i].networks.forEach(function(network) {
      contentHTML += '<div class="content-network">' + network + '</div>';
    });
    contents[i].streams.forEach(function(stream) {
      contentHTML += '<div class="content-stream">' + stream + '</div>';
    });
    contents[i].hashtags.forEach(function(hashtag) {
      contentHTML += '<div class="content-hashtag">' + hashtag + '</div>';
    });
		contentHTML += '</div>';
		contentHTML += '<div class="perma-image-screen"></div><img class="content-image" src="' +contents[i].image + '">'
    contentHTML += '</div>';
  }
  
  return contentHTML;
}
