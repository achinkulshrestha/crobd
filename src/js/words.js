var arr = [];
while(arr.length < 100){
  var randomnumber=Math.ceil(Math.random()*100);
  var found=false;
  for(var i=0;i<arr.length;i++){
	if(arr[i]==randomnumber){found=true;break;}
  }
  if(!found){arr[arr.length]=randomnumber;}
}
var arr_idx = 0;
var count_actions = 0;
var step_num = 1;
function initialParse(){
    $.getJSON('js/config.json',function(json){
        for(var i = 0; i < json['words'].length; i++){
            var word = json['words'][i]['word'];
            var def = json['words'][i]['def'];
            var id = json['words'][i]['id'];
            $("#wordbank_list").append('<li id="'+id+'" name="'+id+'" text="'+word+'">'+word+'</li>');

            $("#response .items-words").sortable({
                connectWith: "#wordbank_list",
                disabled: false,
                over: function(event, ui) {
                    removeIntent = false;
                },
                out: function(event, ui) {
                    removeIntent = true;
                },
                beforeStop: function (event, ui) {
                    if(removeIntent){
                        ui.item.remove();
                        removeTab(ui.item.context.id);
                        // var result = $(this).sortable('toArray', {attribute: 'name'});
                        // var arr = [];
                        // for(var i = 0; i < result.length; i++){
                        //   for(var j = 0; j < json['words'].length; j++){
                        //   if(json['words'][j]['id'] == parseInt(result[i])) {
                        //       arr.push(json['words'][j]['format']);
                        //   }
                        //  }
                        // }
                       //change(arr);
                    }
                },
                receive: function(event, ui) {
                  var result = $(this).sortable('toArray', {attribute: 'name'});
                  $("#parameter_label").show();
                  // Verify Model

                  //showActionInfo(ui.item.context.id);
                //console.log(ui.item.context.id);
                },
                update: function(event, ui) {
                  var result = $(this).sortable('toArray', {attribute: 'name'});
                  var id = arr_idx.toString();
                  ui.item.context.id = id;
                  createTab(id, ui.item.context.innerText, result);
                  count_actions += 1
                  arr_idx += 1;
                  step_num += 1;

                  var result = $(this).sortable('toArray', {attribute: 'name'});
                //   verifyModel(result, function() {
                 //
                //     var id = arr_idx.toString();
                //     ui.item.context.id = id;
                //     createTab(id, ui.item.context.innerText, result);
                //     count_actions += 1
                //     arr_idx += 1;
                //     step_num += 1;
                 //
                //     // var arr = [];
                //     // for(var i = 0; i < result.length; i++){
                //     //   for(var j = 0; j < json['words'].length; j++){
                //     //   if(json['words'][j]['id'] == parseInt(result[i])) {
                //     //       arr.push(json['words'][j]['format']);
                //     //   }
                //     //  }
                //     // }
                //    //change(arr);
                 //
                //  }, function() {
                //    ui.item.remove();
                //  });
                  // Verify Model

                }

            });

            $("#wordbank_list li").draggable({
                helper: "clone",
                connectToSortable: ".items-words"
            });

            var new_dt = $('<dt style="background-image:url(img/'+json['words'][i]['img']+'); background-size: 5%;">'+word+'</dt>').appendTo("#definitions");
             $("#definitions").append('<dd>'+def+'</dd>');

            new_dt.click(function(){
                var img_url = $(this).css('background-image');
                var img_str = img_url.substring(5, img_url.length-2);

                $("#light_img").attr('src', img_str);
                $("#light").css('display', 'block');
                $("#fade").css('display', 'block');
            });
        }


    });
}

function removeTab(id) {
  count_actions -= 1;
  $('#li-'+id).remove();
  $('#tab-'+id).remove();
  $('#response_tabs_nav a:first').tab('show');
}

function verifyModel(sequence, retFunc, retFunc2) {
  var model = new actionModel(sequence);
  model.valid(callback, retFunc, retFunc2);
}

function callback(result, retFunc, retFunc2){
  if (!result.isValid) {
    retFunc2();
    bootbox.alert(result.error);

  }
  else {
    retFunc();
  }
}

function createTab(id, name, result){
  var myvar;
  switch(name) {
    case "Release":
    myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'">'+
    '<div><p class="lead">Param 1. Select intensity of release action?</p>'+
    '<div class="form-horizontal">'+
    '  <div class="form-group">'+
    ''+
    '<label for="rangeSlider'+id+'" class="col-sm-2">Slow release</label>'+
    '<div class="col-sm-8">'+
    '<input title="Intensity of the release actions: " name="releaseRange" id="rangeSlider'+id+'" type="range" min="1" max="10" step="1" value="5"/>'+
    '</div>'+
    '<label class="col-sm-2 ">Quick release</label>'+
    '</div>'+
    '</div></div></fieldset>';
      break;

    case "Push":
    myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'"><div>'+
    '<p class="lead">Param 1. Select intensity of push action?</p>'+
    '<div class="form-horizontal">'+
    '  <div class="form-group">'+
    ''+
    '<label for="rangeSlider'+id+'" class="col-sm-1">Too less</label>'+
    '<div class="col-sm-10">'+
    '<input title="Intensity of the push action: " name="pushRange" id="rangeSlider'+id+'" type="range" min="1" max="10" step="1" value="5"/>'+
    '</div>'+
    '<label class="col-sm-1">Too much</label>'+
    '</div>'+
    '</div></div></fieldset>';
      break;
    case "Grasp":
      myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'"><div>'+
              '<p class="lead">Param 1. Which hand?</p>'+
              '<div class="radio">'+
              '    <label>'+
              '      <input type="radio" class="rg lefthandradio" title="Hand used for Grasp" name="leftRadio'+id+'" id="leftGrabRadio" value="Left-Hand">'+
              '      Left hand'+
              '    </label>'+
              '  </div>'+
              '  <div class="radio">'+
              '    <label>'+
              '      <input type="radio" class="rg righthandradio" title="Hand used for Grasp" name="leftRadio'+id+'" id="rightGrabRadio" value="Right-Hand" checked>'+
              '       Right hand'+
              '      </label>'+
              '  </div>'+
              '</div>'+
              '<div>'+
              '<p class="lead">Param 2. Which Hand Posture?</p>'+
              '<p>Please select the posture of hand while performing this action!</p>'+
              '<div class="container img-responsive">'+
              '    <div class="row">'+
              '        <div class="col-lg-4">'+
              '             <a href="#" class = "falseLink">'+
              '             <img class="lefthand" src="img/01-hand.jpg" alt="..." />'+
              '            <img class="righthand" src="img/04-hand.jpg" alt="..." />'+
              '            </a>'+
              '        </div>'+
              '          <div class="col-lg-4">'+
              '             <a href="#" class = "falseLink">'+
              '            <img class="lefthand" src="img/02-hand.jpg" alt="..." />'+
                  '         <img class="righthand" src="img/05-hand.jpg" alt="..." />'+
              '            </a>'+
              '        </div>'+
              '         <div class="col-lg-4">'+
              '             <a href="#" class = "falseLink">'+
              '            <img class="lefthand" src="img/03-hand.jpg" alt="..." />'+
              '            <img class="righthand" src="img/06-hand.jpg" alt="..." />'+
              '            </a>'+
              '        </div>'+
              '    </div>'+
              '</div>'+
              '</div>'+
              '<p class="lead">Param 3. Select the center of the grab action in the preview image.</p>'+
              '<button class="btn btn-default" data-toggle="collapse" data-target="#instruction">Detailed instructions</button>'+
              '<div id="instruction" class="collapse">'+
              'Click on the grasp point inside the preview image above, a red dot should appear. To re-select, move the selection on the image on the left.</div></br>'+
              '<p id="pointSelected" class="bg-warning">Point not selected yet!</p></fieldset>';

      break;
    case "Pull":
      // Slider force
      myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'"><div><p class="lead">Param 1. Select intensity of pull action?</p>'+
      '<div class="form-horizontal">'+
      '  <div class="form-group">'+
      ''+
      '<label for="rangeSlider" class="col-sm-1">Too less</label>'+
      '<div class="col-sm-10">'+
      '<input id="rangeSlider'+id+'" title="The intensity of the Pull action" name="pullSlider" type="range" min="1" max="10" step="1" value="5"/>'+
      '</div>'+
      '<label class="col-sm-1">Too much</label>'+
      '</div>'+
      '</div></div></fieldset>';
      break;
    case "Press":
    myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'"><div>'+
                '<p class="lead">Param 1. Which Hand?</p>'+
            '<div class="radio">'+
            '    <label>'+
            '      <input type="radio" class="rg lefthandradio" title="Hand used for press action" name="pressRadio'+id+'" id="leftPressRadio" value="Left-Hand">'+
            '      Left hand'+
            '    </label>'+
            '  </div>'+
            '  <div class="radio">'+
            '    <label>'+
            '      <input type="radio" class="rg righthandradio" title="Hand used for press action" name="pressRadio'+id+'" id="rightPressRadio" value="Right-Hand" checked>'+
            '       Right hand'+
            '      </label>'+
            '  </div>'+
            '</div>'+
            '<div>'+
            '<p class="lead">Param 2. Select hand posture?</p>'+
            '<p>Please select the posture of hand while performing this action!</p>'+
            '<div class="container img-responsive">'+
            '    <div class="row">'+
            '        <div class="col-lg-4">'+
            '             <a href="#" class = "falseLink">'+
            '             <img class="lefthand" src="img/01-hand.jpg" alt="..." />'+
            '            <img class="righthand" src="img/04-hand.jpg" alt="..." />'+
            '            </a>'+
            '        </div>'+
            '          <div class="col-lg-4">'+
            '             <a href="#" class = "falseLink">'+
            '            <img class="lefthand" src="img/02-hand.jpg" alt="..." />'+
                '         <img class="righthand" src="img/05-hand.jpg" alt="..." />'+
            '            </a>'+
            '        </div>'+
            '         <div class="col-lg-4">'+
            '             <a href="#" class = "falseLink">'+
            '            <img class="lefthand" src="img/03-hand.jpg" alt="..." />'+
            '            <img class="righthand" src="img/06-hand.jpg" alt="..." />'+
            '            </a>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '</div>'+
            '<p class="lead">Param 3. Select the center of the press action in the preview image.</p>'+
            '<button class="btn btn-default" data-toggle="collapse" data-target="#instructionpress">Detailed instructions</button>'+
            '<div id="instructionpress" class="collapse">'+
            'Click on the grasp point inside the preview image above, a red dot should appear. To re-select, move the selection on the image on the left.</div></br>'+
            '<p id="pointSelected" class="bg-warning">Point not selected yet!</p>'+
            '<input type="hidden" name="xGraspSelection"/>'+
            '<input type="hidden" name="yGraspSelection"/></fieldset>';
      break;
    case "Rotate":
      myvar = '<fieldset id="fieldid-'+id+'" name="fieldName-'+result[result.length-1]+'"><p class="lead">Param 1. Direction of rotation.</p>'+
      '<div class="radio">'+
      '    <label>'+
      '      <input type="radio" title="Direction of rotation" name="rotateRadio'+id+'" id="optionsRadios1" value="Clockwise" checked>'+
      '      Clockwise'+
      '    </label>'+
      '  </div>'+
      '  <div class="radio">'+
      '    <label>'+
      '      <input type="radio" title="Direction of rotation" name="rotateRadio'+id+'" id="optionsRadios2" value="Anticlockwise">'+
      '      Anti-clockwise'+
      '    </label>'+
      '  </div>'+
      '      <p class="lead">Param 2. Angle of rotation</p>'+
      '      <input type="text" title="Angle of rotation" name="rotationAngle" class="form-control" id="rotationangle" placeholder="Enter angle in degrees">'+
      '      <small class="text-muted">Take positive x axis as reference</small>'+
      '    </div></fieldset>';
      break;

    //  $("#response_tabs_nav").append($('&lt;/pre&gt;&lt;ul&gt;&lt;li&gt;&lt;a href=&quot;
  }

      if (arr_idx == 0) {
          $("#response_tabs_nav").append('<li class="active" id="li-'+id+'"><a data-toggle="tab" href="#tab-'+id+'">'+name+'</a></li>');
      }
      else {
          $("#response_tabs_nav").append('<li id="li-'+id+'"><a data-toggle="tab" href="#tab-'+id+'">'+name+'</a></li>');
      }
      if (arr_idx == 0) {
     $("#response_tabs").append('<div id="tab-'+id+'" class="tab-pane fade in active"></div>');
    }
    else {
     $("#response_tabs").append('<div id="tab-'+id+'" class="tab-pane fade"></div>');
    }
    //  myvar = $("<div />").html(myvar).text();

    document.getElementById("tab-"+id).innerHTML = myvar;
    $('a[href="#tab-'+id+'"]').tab('show');
    addhandlers();
}
function addhandlers(){
  $('.falseLink').click(function(ev){
    // do whatever you want here
    ev.preventDefault();
    ev.stopPropagation();
  });
  $(".radio").change(function(){
  if ($('.lefthandradio').is(':checked')) {
    $('.lefthand').show();
    $('.righthand').hide();
  }
  else {
    $('.lefthand').hide();
    $('.righthand').show();
  }
  });
  $(".lefthand").click(function() {
    $('.lefthand').removeClass('selected');
    $(this).addClass("selected");
  });
  $(".righthand").click(function() {
    $('.righthand').removeClass('selected');
    $(this).addClass("selected");
  });
}
function change(result) {
    var $scope = angular.element($('#controlN')).scope();
    $scope.$apply(function() {
        $scope.words = result;
    });
}

function showActionInfo(word_id)
{
   // If no cookie with our chosen name (e.g. no_thanks)...
       if ($.cookie("no_thanks"+word_id) == null) {
         $('#myModal').appendTo("body");
         $('#myModal').find('#'+word_id).show();
         $('#myModal').modal('show');
       }
       // On click of specified class (e.g. 'nothanks'), trigger cookie, which expires in 100 years
        $(".nothanks").click(function() {
          $.cookie('no_thanks'+word_id, 'true', { expires: 36500, path: '/' });
        });
        $(".done").click(function() {
          $('fieldset').filter('#'+word_id+'-form-content').show();
          $('fieldset').not('#'+word_id+'-form-content').hide();
          $('#myModal').find('#'+word_id).hide();
        });
}

app = angular.module('myApp', []);
app.controller('wordController', function ($scope) {
$scope.words = [];
});


app.controller('elementController', function ($scope) {
$scope.words = [];
})
.directive('dynamicElement', function() {
    function link(scope, element, attrs) {
        //console.log(scope);

        angular.forEach(scope.elements, function(value, key) {
            // create an element based on its type
            var node = $("<div></div>");
            var newElement;
            switch(value.component) {
              case "header":
                  newElement = $('<div></div>').append(
                    $("<h3></h3>").text(value.content)
                  );
                  node.append(newElement);
                  break;
              case "text":
                  newElement = $('<div></div>').append(
                    $("<p></p>").text(value.content)
                  );
                  node.append(newElement);
                  break;
              case "handpicker":
                  var selectEl = $('<select>').attr({'class':'image-picker'});
                  var option = selectEl.append(
                    $("<option>").attr({ 'data-img-src': 'img/01-hand.jpg' },{'value': '1'}).text("Left-Hand Posture 1"),
                    $("<option>").attr({ 'data-img-src': 'img/02-hand.jpg' },{'value': '2'}).text("Left-Hand Posture 2"),
                    $("<option>").attr({ 'data-img-src': 'img/03-hand.jpg' },{'value': '3'}).text("Left-Hand Posture 3"),
                    $("<option>").attr({ 'data-img-src': 'img/04-hand.jpg' },{'value': '4'}).text("Right-Hand Posture 1"),
                    $("<option>").attr({ 'data-img-src': 'img/05-hand.jpg' },{'value': '5'}).text("Right-Hand Posture 2"),
                    $("<option>").attr({ 'data-img-src': 'img/06-hand.jpg' },{'value': '6'}).text("Right-Hand Posture 3")
                  );
                  newElement = $('<div></div>').append(option);
                  node.append(newElement);
                  $("select").imagepicker({
                    hide_select : true,
                    show_label  : false
                  });
                  break;
              case "textbox":
                  node.append($('<div></div>').append(
                    $("<h4></h4>").text(value.content)
                  ));
                  node.append($('<input>').attr({
                    class:'form-control'
                  }));
                  break;
                  // var inputElement = document.createElement("input");
                  // inputElement.setAttribute("class", "form-group");
                  // node.appendChild(newElement);
                  // node.appendChild(inputElement);
                  // break;
              case "radiobutton":
                  node.append($('<div></div>').append(
                    $("<h4></h4>").text(value.content)
                  ));
                  node.append($('<p></p>').text(value.firstText))
                  node.append($('<input>').attr({
                    type: 'radio',
                    name: 'step2-radio',
                    class:'form-group'
                  }));
                  node.append($('<p></p>').text(value.secondText))
                  node.append($('<input>').attr({
                    type: 'radio',
                    name: 'step2-radio',
                    class:'form-group'
                  }));

                  break;
                case "slider":
                node.append($('<div></div>').append(
                  $("<h4></h4>").text(value.content)
                ));
                  node.append($('<input>').attr({
                    id:'slide',
                    type:"range",
                    min:"1",               // default 0
                    max:"10",                  // default 100
                    step:"1",                   // default 1
                    value:"5",
                  }));
            }
            element.append(node);
        });
    };

    return {
        restrict: 'A',
        scope: {
            elements : '='
        },
        link: link
    };
})
;
initialParse();
