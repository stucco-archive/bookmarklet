(function() {
  userid = idGenerator(8);

  loadD3();

  function loadD3() {
    loadScript('http://d3js.org/d3.v3.min.js', loadPico);
  }

  function loadPico() {
    loadScript('http://localhost:8001/components/PicoModal/picoModal.js', modalForm);
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
  
    // fire the loading
    head.appendChild(script);
  }
  
  function modalForm(source) {
    // load form css
    d3.select('head').append('link')
      .attr('rel', 'stylesheet')
      .attr('type', 'text/css')
      .attr('href', 'http://localhost:8001/forms/form.css');

    // load source html
    var sourceRequest = new XMLHttpRequest();
    sourceRequest.open('GET', 'http://localhost:8001/forms/stucco.html', false);
    sourceRequest.send();
  
    // launches a modal dialog with the form
    var modal = picoModal({
      content: sourceRequest.responseText,   
      closeButton: false,
      shadowClose: false
    }); 
  
    // find the just-created form
    var form = d3.select(modal.modalElem).select('form');
  
    // submit the data using d3.xhr
    form.on('submit', function(){
      d3.event.preventDefault();
  
      var formData = {
        relevance:    getRadioSelection('relevance'),
        importance:   getRadioSelection('importance'),
        credibility:  getRadioSelection('credibility')
      };
  
      var data = {
        "form": formData,
        "userid": userid,
        "type": 'form'
      }; 
  
      var xhr = d3.xhr('http://localhost:8001/')
        .header('Content-type', 'application/json')
        .post(JSON.stringify(data));
  
      xhr.on('load', function (res) {
        console.log('successful POST of '+data.type);
      })
      .on('error', function (res) {
        console.log('failed POST of '+data.type);
      })
  
      modal.close();
    });
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
  
  function idGenerator(idLength)
  {
  	var id = "";
    var possible = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for( var i=0; i < idLength; i++ ) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
  }

})();
