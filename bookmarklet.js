(function() {

var title = document.title;
var href = document.location.href;
var script = document.createElement('script');
var name = prompt('What is your name?');


// load jquery
script.src = 'http://code.jquery.com/jquery-1.9.1.min.js';
head.appendChild(script);

// TODO append a div to document

// do a jquery post
// TODO check for jquery conflicts
$.post('http://localhost/name', { name: answer }); void 0;

}())
