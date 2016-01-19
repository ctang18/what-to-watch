$(document).ready(function() { 
  console.log("Document Ready");
  getContent();
});

function getContent(){
  $.get('api/content')
    .done(function (result) {
      if(result.success){
        //Display content
        console.log("GET request success");
        console.log(result);
        renderCurrent(result.currentContent);
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
    contentHTML += '<div class="content"><div class="content-iota content-link with-thumb">';
    contentHTML += '<div class="content-link-title">' + contents[i].title + '</div><br />';
    contentHTML += '<div class="content-subtitle">' + contents[i].networks[0] + '</div>';
		contentHTML += '<div class="content-hashtag">' + contents[i].hashtags[0] + '</div>';
		contentHTML += '</div>';
		contentHTML += '<div class="perma-image-screen"></div><img class="content-image" src="' +contents[i].image + '"></div>';
  }
  $('#currentContent').html(contentHTML);
}
