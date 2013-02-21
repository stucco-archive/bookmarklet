(function() {
  'use strict';

  // append form

  // load jquery
  var js = document.createElement('script');
  js.src = 'http://code.jquery.com/jquery-1.9.1.min.js';
  document.head.appendChild( js );
    
  // form behavior
  $('#relevance').bind('change', function(){
    $('#relevanceValue').text( $(this).val() );
  });
  $('#send').bind('click', function(){
    var data = {
      "relevance"  :  $('#relevance').val(), 
      "title"      :  document.title,
      "href"       :  document.location.href
    }
    console.log(data);
    //$.post
  });

  void(0);
}())
