$(document).ready(function(){
$('#startUpModal').modal('show');
$(document).on("click", "#noTourBtn", function(event){
  $('#startUpModal').modal('toggle');
});

$(document).on('keyup', "#objName", function(){
     var allFilled = true;
     if($('#objName').val() == "") {
       allFilled = false;
    }
    $('#step1_continue').prop('disabled', !allFilled);
});
$('#finalSubmit').click(function(){
  bootbox.dialog({
    message: "Are you sure you want to submit?",
    title: "Final call!",
    buttons: {
      success: {
        label: "Yes!",
        className: "btn-success",
        callback: function() {
          location.replace("/success.html");
        }
      },
      danger: {
        label: "Need to make changes!",
        className: "btn-danger",
        callback: function() {
          return;
        }
      }
    }
  });
});
});




$('.next').click(function(){
  var nextId = $(this).parents('.tab-pane').next().attr("id");
  var title = $(this).parents('.tab-pane').next().attr("title");
  $("#titleText").text(title);
  $('#attr-'+nextId).removeClass('disabled_link');
  $('[href=#'+nextId+']').tab('show');
  return false;
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //update progress
  var step = $(e.target).data('step');
  var percent = (parseInt(step) / 4) * 100;

  $('.progress-bar').css({width: percent + '%'});
  $('.progress-bar').text("Step " + step + " of 4");
  //e.relatedTarget // previous tab
});

$(function(){
 $('#slide').slider({
formater: function(value) {
  return 'Current value: ' + value;
}
});
});


// With JQuery
$('#ex1').slider({
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

// Click on enter press
$(document).ready(function(){
    $('#objName').keypress(function(e){
      if(e.keyCode==13)
      $('#step1_continue').click();
    });

});

$(document).ready(function () {
    $('.main-img').imgAreaSelect({
        handles: true,
        fadeSpeed: 200,
        onSelectChange: preview
    });
});

$(document).ready(function () {
  var summary = [];
  // $('#step3_continue').click(function(){
  //   //$('#expForm').submit();
  // })
  $('#step3_continue').click(function(event){
        event.preventDefault();
          // $('#summary').text(JSON.stringify($('form > fieldset').serializeObject()));
          var fieldsets = $("fieldset").get();
          var output = {};
          var o;
          var result = $('#response .items-words').sortable('toArray', {attribute: 'name'});
          output['action_sequence'] = result;
          output['sequence_params'] = [];
          var new_o = output['sequence_params'];
          for(var x=0; x < fieldsets.length; x++){
            if (x == 0) {
              output[fieldsets[x].getAttribute("id")] = {};
              o = output[fieldsets[x].getAttribute("id")];
              o["type_id"] = fieldsets[x].getAttribute("name");
              o["object_name"] = $("#objName").val();
            }
            else {
              var o = {};
              o["type_id"] = fieldsets[x].getAttribute("name").split("-")[1];
              o["elements"] = [];
              var fieldtags= ['input', 'select'];
              for (var tagi=0; tagi< fieldtags.length; tagi++) {
                var fields= fieldsets[x].getElementsByTagName(fieldtags[tagi]);
                for (var fieldi=0; fieldi < fields.length; fieldi++) {
                    var curr_element = {};
                    var type = fields[fieldi].getAttribute("type");

                    curr_element["name"] = fields[fieldi].getAttribute("name");
                    var id = fields[fieldi].getAttribute("id");
                    switch (type){
                      case "radio":
                        if (document.getElementById(id).checked) {
                          curr_element["title"] = fields[fieldi].getAttribute("title");
                          curr_element["value"] = fields[fieldi].value;
                        }
                        else{
                          curr_element["value"] = curr_element["title"] = null;
                        }
                        break;
                      case "range":
                        curr_element["title"] = fields[fieldi].getAttribute("title");
                        curr_element["value"] = fields[fieldi].value;
                      case "text":
                        curr_element["title"] = fields[fieldi].getAttribute("title");
                        curr_element["value"] = fields[fieldi].value;
                    }
                    o["elements"].push(curr_element);
                }
              }
              new_o.push(o);
            }

          }
        presentSummary(output);
    });
  });

function presentSummary(output){
$("#summary").empty();
var sequence_mapping = {"3":"Push", "1":"Pull", "4":"Release", "2":"Rotate", "5":"Press","0":"Grasp"};
var object_name = output["objFieldset"]["object_name"];
var action_sequence = output["action_sequence"];
var sequence_params = output["sequence_params"];
var result = '<p><b>Name of the object: '+object_name+'<b></p>';
var result_div = $("<div></div>");
result_div.append(result);
result_div.append('<b>Selected action sequence: </b>');
// Create sequence of actions
$.each(action_sequence, function(idx, value){
  // Let's create the DOM
   var sequence_disp = $('<kbd>');
   if (idx < action_sequence.length-1) {
     sequence_disp.text(sequence_mapping[value]+"->");
   } else {
     sequence_disp.text(sequence_mapping[value]);
   }
   sequence_disp.appendTo(result_div);
});

$("#summary").append(result_div);

var param_div = $("<div></div>");

$.each(sequence_params, function(idx, value){
  param_div.append('<b>Action '+idx+': '+sequence_mapping[value["type_id"]]+'</b>');

  $.each(value["elements"], function(idx, value){
      if (value["title"] && value["value"]) {
          param_div.append('<p>'+value["title"]+': '+value["value"]+'</p>');
      }
  });
// param_div.before( "</br>" );
$("#summary").append(param_div);

});


}

function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    $("#preview > p").hide();
    $("#preview > canvas").show();
    var canvas = document.getElementById('preview_img');
    canvas.width = selection.width;
    canvas.height = selection.height;
    var ctx = canvas.getContext("2d");
    var base_image = new Image();
    base_image.src = $('#outputImage').attr('src');

    ctx.drawImage(base_image, selection.x1, selection.y1, selection.width, selection.height, 0, 0, selection.width, selection.height);
    canvas.addEventListener("mousedown", getPosition, false);
  }

function getPosition(event)
{
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("preview_img");
  var rect = canvas.getBoundingClientRect();
   x = x - rect.left;
   y = y - rect.top;
  // x -= canvas.offsetLeft;
  // y -= canvas.offsetTop;
  var context = canvas.getContext("2d");
  context.beginPath();
  context.arc(x, y, 5, 0, 2*Math.PI);
  context.fillStyle = "#FF0000";
  context.fill();
  context.closePath();
  canvas.removeEventListener('mousedown', getPosition, false);
  $("#pointSelected").text("Point selected");
  $("#pointSelected").removeClass("bg-warning");
  $("#pointSelected").addClass("bg-success");
  $("#xSelection").text(x);
  $("#ySelection").text(y);

}

$(document).ready(function() {
  $("#response_tabs_nav").on("click", "a", function(e){
    e.preventDefault();
    $(this).tab('show');
  });


});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

$(document).ready(function() {
  var img = new Image();
  img.src = 'img/fire_door.jpg';
  img.onload = function(){
    var mainCanvas = document.createElement("canvas");
    mainCanvas.width = 300;
    mainCanvas.height = 300;
    var ctx = mainCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
    $('#outputImage').attr('src', mainCanvas.toDataURL("image/jpeg"));
  };
});


$(document).ready(function(){

});
