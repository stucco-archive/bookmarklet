var modalForm = function(source) {
  // load source html
  var sourceRequest = new XMLHttpRequest();
  sourceRequest.open('GET', source, false);
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

    var xhr = d3.xhr('/')
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
