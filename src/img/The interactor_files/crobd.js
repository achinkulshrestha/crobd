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
});
$('.next').click(function(){
  var nextId = $(this).parents('.tab-pane').next().attr("id");
  $('#attr-'+nextId).removeClass('disabled_link');
  $('[href=#'+nextId+']').tab('show');
  return false;
})

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //update progress
  var step = $(e.target).data('step');
  var percent = (parseInt(step) / 4) * 100;

  $('.progress-bar').css({width: percent + '%'});
  $('.progress-bar').text("Step " + step + " of 4");
  //e.relatedTarget // previous tab
})

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
function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
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
  $("#pointSelected").text("Point selected x:" + x + " y:" + y);
  $("#pointSelected").removeClass("bg-warning");
  $("#pointSelected").addClass("bg-success");
  //alert("x:" + x + " y:" + y);
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
  mainCanvas = document.createElement("canvas");
  mainCanvas.width = 400;
  mainCanvas.height = 400;
  var ctx = mainCanvas.getContext("2d");
  ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
  $('#outputImage').attr('src', mainCanvas.toDataURL("image/jpeg"));
});
