(function() {
var protocol = document.location.protocol
  , userid   = stuccoId //stuccoId is determined via user email
  , modal
  , statusEl
  , $ = function(id) { return document.getElementById(id); };

// load picoModal before launching the modal form
loadScript(protocol+host+'components/PicoModal/picoModal.min.js', init);

function init(source) {
  console.log(picoModal);
  loadCSS(protocol+host+'pure.css');
  loadCSS(protocol+host+'components/cleanslate/cleanslate.min.css');
  loadCSS(protocol+host+'stucco.css');

  modal = launchModal(protocol+host+'stucco.html'); 

  $('document-title').innerHTML = 'Title: ' + document.title;
  $('document-url').innerHTML   = 'URL:   ' + document.URL;
  statusEl = $('document-status');
  $('stuccoSubmit').addEventListener('click', postAndClose, false);
}

function postAndClose(e) {
  e.preventDefault();
  var d = processStuccoForm();
  postJSON(protocol+host+'', JSON.stringify(d));
  modal.close();
}

function launchModal(loc) {
  var opts = {
    content: loadHTML(loc),   
    closeButton: false,
    shadowClose: false
  }  
  return picoModal(opts); 
}

function processStuccoForm() {
  return {
      url:          document.URL,
      date:         new Date(),
      relevance:    getRadioSelection('relevance'),
      concept:      getCheckboxSelection('concept'),
      credibility:  getRadioSelection('credibility'),
      userid:       userid
    };
}

function postJSON(loc, data) {
  var req = new XMLHttpRequest();
  req.open('POST', loc, true);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(data);
  req.addEventListener('load', function(e) {
    if (req.status === 404) {
      var msg = 'Error posting, unable to connect to server: ' + req.statusText;
      showStatus('error', msg);
      console.log(msg);
      return false;
    }
    showStatus('success', 'Successfully posted for url: ' + data.url);
    console.log('Successfully posted ' + e);
  }, false);
  req.addEventListener('error', function(e) {
    showStatus('error', 'Unable to post url: ' + data.url);
    console.log('Error posting ' + e);
    postJSON('/error', JSON.stringify({msg: "error on POST"}));
  }, false);
}

// status = 'success' or 'error'
function showStatus(status, msg) {
  console.log(statusEl)
  if (status) { statusEl.className = 'status-' + status; }
  statusEl.innerHTML = msg;
  statusEl.style.display = 'block';
}

function getRadioSelection(radioName) {
  var radios = document.getElementsByName(radioName);
  var value;
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio' && radios[i].checked) {
      value = radios[i].value;       
    }
  }
  return value;
}

function getCheckboxSelection(name) {
  var checks = document.getElementsByName(name);
  var d = [];
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].type === 'checkbox' && checks[i].checked) {
      d.push( checks[i].value );
    }
  }
  return d;
}

// from http://stackoverflow.com/a/950146
function loadScript(url, callback) {
  // adding the script tag to the head as suggested before
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  // then bind the event to the callback function 
  // there are several events for cross browser compatibility
  script.onreadystatechange = callback;
  script.onload = callback;
  head.appendChild(script);
}

function loadCSS(file) {
  var head = document.getElementsByTagName('head')[0];
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  css.href = file;
  head.appendChild(css);
}

function loadHTML(loc) {
  var req = new XMLHttpRequest();
  req.open('GET', loc, false);
  req.send();
  return req.responseText;
}


})();
