// paste single-line css here
var formCSS = 'body { font-family: "Trebuchet MS";}h3 { padding-top: 0px;}label, div.label {  line-height:150%;  font-weight:bold;}.pico-content { overflow: auto; height: 80%;}.formSection { margin-top: 15px;}#rankedPairs > label {   display: inline-block;  width: 180px;}.label:after, label:not(.optional):after {   content: " *";  color: red;} ';

// inject css
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = formCSS;
document.getElementsByTagName('head')[0].appendChild(style);

// paste single-line form here
var stuccoForm = '<h1>Stucco Document Relevance</h1><form id="stucco" action="/" method="POST"><div class="formSection"><label for="relevance">Relevance</label><br>Not Relevant<input type="radio" name="relevance" value="1" required><input type="radio" name="relevance" value="2" required><input type="radio" name="relevance" value="3" required><input type="radio" name="relevance" value="4" required><input type="radio" name="relevance" value="5" required>Very Relevant</div><div class="formSection"><label for="importance">Importance</label><br>Not Important<input type="radio" name="importance" value="1" required><input type="radio" name="importance" value="2" required><input type="radio" name="importance" value="3" required><input type="radio" name="importance" value="4" required><input type="radio" name="importance" value="5" required>Very Important</div><div class="formSection"><label for="credibility">Credibility</label><br>Not Credible<input type="radio" name="credibility" value="1" required><input type="radio" name="credibility" value="2" required><input type="radio" name="credibility" value="3" required><input type="radio" name="credibility" value="4" required><input type="radio" name="credibility" value="5" required>Very Credible</div><div class="formSection">  <input type="submit" value="Submit"></div></form>';


var modalForm = function(source) {
  // load source html
//  var sourceRequest = new XMLHttpRequest();
//  sourceRequest.open('GET', 'forms/form.css', false);
//  sourceRequest.send();
//  console.log(sourceRequest.responseText.replace(/(\r\n|\n|\r)/gm,""));

  // launches a modal dialog with the form
  var modal = picoModal({
    content: stuccoForm,   
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
