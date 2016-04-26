function initialParse(){
    $.getJSON('js/config.json',function(json){
        for(var i = 0; i < json['words'].length; i++){
            var word = json['words'][i]['word'];
            var def = json['words'][i]['def'];

            $("#wordbank_list").append('<li id="word_'+(i+1)+'" text="'+word+'">'+word+'</li>');

            $("#response .items-words").sortable({
                connectWith: "#wordbank_list",
                over: function(event, ui) {
                    removeIntent = false;

                },
                out: function(event, ui) {
                    removeIntent = true;

                },
                beforeStop: function (event, ui) {
                    if(removeIntent){
                        ui.item.remove();
                    }
                },
                receive: function(event, ui) {
                  showActionInfo(ui.item.context.id);
                  console.log(ui.item.context.id);
                }

            });

            $("#wordbank_list li").draggable({
                helper: "clone",
                connectToSortable: ".items-words"
            });

            var new_dt = $('<dt style="background-image:url(pics/'+json['words'][i]['img']+'); background-size: 5%;">'+word+'</dt>').appendTo("#definitions");
            //
            // $("#definitions").append('<dd>'+def+'</dd>');

            // new_dt.click(function(){
            //     var img_url = $(this).css('background-image');
            //     var img_str = img_url.substring(5, img_url.length-2);
            //
            //     $("#light_img").attr('src', img_str);
            //     $("#light").css('display', 'block');
            //     $("#fade").css('display', 'block');
            // });
        }


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
initialParse();
