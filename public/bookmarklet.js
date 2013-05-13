// TODO script for javascript:encodeURIComponent('<all the js in this file>')
// TODO add form POST functions from experimentr to this file
// TODO have some kind of persistent ID built into this script so it stays with the user

(function() {
  'use strict';

  var d = document;
  var s = d.createElement('script');
  s.src = 'http://code.jquery.com/jquery-1.9.1.min.js';
  // TODO load picoModal via XHR
  s.onload = function() {
    jQuery.noConflict(true)(function($){
      // TODO load form via XHR
      var form = ['<form>'
        , '<label>Relevance</label>'
        , '<input id="relevance" type="range" min="1" max="5" step="1" required />'
        , '<span id="relevanceValue">3</span>'
        , '<br />'
        , '<input id="send" type="button" value="send" />'
        , '</form>'
      ].join('');
  
      $('body').append(form);
  
      //   form behavior
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
        // TODO post instead
      });
      d.getElementsByTagName('head')[0].appendChild(s);
    });
  };
  d.getElementsByTagName('head')[0].appendChild(s);
  void(0);
}())



