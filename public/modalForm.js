(function() {
  var protocol = document.location.protocol;

  var userid = idGenerator(8);

  // load picoModal before launching the modal form
  loadPico();
  function loadPico() {
    loadScript(protocol+'//localhost/components/PicoModal/picoModal.js', modalForm);
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
  
  function modalForm(source) {
    // load form css
    var head = document.getElementsByTagName('head')[0];

    // TODO make a loadCSS function with href as parameter
    var cleanslate = document.createElement('link');
    cleanslate.rel = 'stylesheet';
    cleanslate.type = 'text/css';
    cleanslate.href = protocol+'//localhost/components/cleanslate/cleanslate.css';
    head.appendChild(cleanslate);

    var formcss = document.createElement('link');
    formcss.rel = 'stylesheet';
    formcss.type = 'text/css';
    formcss.href = protocol+'//localhost/forms/form.css';
    head.appendChild(formcss);

    // load source html
    var sourceRequest = new XMLHttpRequest();
    sourceRequest.open('GET', protocol+'//localhost/forms/stucco.html', false);
    sourceRequest.send();
  
    // launches a modal dialog with the form
    var modal = picoModal({
      content: sourceRequest.responseText,   
      closeButton: false,
      shadowClose: false
    }); 
  
    document.getElementById('stuccoSubmit').addEventListener(
      'click', postData, false
    );
  
    // submit the data using XMLHttpRequest()
    function postData(e) {
      e.preventDefault();
  
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

      var postReq = new XMLHttpRequest();
      postReq.open('POST', protocol+'//localhost/', true);
      postReq.setRequestHeader('Content-type', 'application/json')
      postReq.send(JSON.stringify(data));

      postReq.addEventListener('load', function() {
        console.log('successful POST of '+data.type);
      }, false);

      postReq.addEventListener('error', function() {
        console.log('failed POST of '+data.type);
      }, false);
  
      modal.close();
    }
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
