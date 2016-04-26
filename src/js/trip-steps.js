$(document).ready(function(){
  var trip = new Trip([
  { sel : $(".step1-trip"), content : "Talk about the canvas element", position : "n", expose : true},
  { sel : $(".step2-trip"), content : "Explain Working space", position : "n", expose : true},
  { sel : $(".step3-trip"), content : "Explain word bank", position : "n", expose : true},
  { sel : $(".step4-trip"), content : "That's pretty much it, let's begin", position : "w", expose : true},
], {
  delay : 4000,
  animation: 'fadeIn'
});
$(".start-tour").on("click", function(event){
    $('#startUpModal').modal('toggle');
    trip.start();
});
});
