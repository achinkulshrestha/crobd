$(document).ready(function(){
  var trip = new Trip([
  { sel : $(".step1-trip"), content : "This image contains one or more objects that you can interact with.", position : "e", expose : true},
  { sel : $(".step2-trip"), content : "There are 4 steps you need to follow to complete the experiment. This space would guide you through those steps.", position : "s", expose : true},
  { sel : $(".step3-trip"), content : "For every object in the image, you need to choose actions depending on how you would interact with the object. Each object would have different sequence of actions. This word bank gives you a list of actions to choose from", position : "s", expose : true},
  { sel : $("#step1"), content : "That's pretty much it, let's begin from step 1", position : "s", expose : true},
], {
  delay : -1,
  animation: 'fadeIn',
  showNavigation : true,
  onStart : function() {
    if ($.cookie("no_thanks_trip1") != null) {
      trip.stop();
    }
  },
   onEnd : function() {
    if ($.cookie("no_thanks_trip1") == null) {
     bootbox.dialog({
       message: "Do you want to see the tutorial again later?",
       title: "Tutorial!",
       buttons: {
         success: {
           label: "Yes!",
           className: "btn-success",
           callback: function() {
             return;
           }
         },
         danger: {
           label: "No, I understood everything!",
           className: "btn-danger",
           callback: function() {
             var date = new Date();
             var minutes = 120;
             date.setTime(date.getTime() + (minutes * 60 * 1000));
             $.cookie("no_thanks_trip1", null, { path: '/' });
             $.cookie('no_thanks_trip1', 'true', { expires: date, path: '/' });
             return;
           }
         }
       }
     });
    }

   }
});

var tripStep2 = new Trip([
{ content : "Select the object in the image on the left. Watch the video tutorial to get to know steps!", theme: "black", position : "screen-center", expose : true},
], {
  onStart : function() {
       $('#football_example').collapse('show');
 },
 onEnd : function() {
    $('#football_example').collapse('hide');
 },
delay : -1,
animation: 'fadeIn',
showNavigation : true
});


var tripStep3 = new Trip([
{ content : "Now, you have to define the sequence of actions to take in order to interact with the object you selected in the image", position : "screen-center", expose : true},
{ sel : $("#wordbank_list"), content : "This is the word bank, choose appropriate actions from here. Click, hold and drag the thumbnails to the response box", position : "w", expose : true},
{ sel : $("#response_list"), content : "This is the response box, drag the words here.", position : "n", expose : true}
], {
delay : -1,
animation: 'fadeIn',
showNavigation : true
});




$(".start-tour").on("click", function(event){
    $('#startUpModal').modal('toggle');
    trip.start();
});


$("#step1_continue").on("click", function(event){

  //  tripStep2.start();


});

$("#step2_continue").on("click", function(event){
    tripStep3.start();
});


});
