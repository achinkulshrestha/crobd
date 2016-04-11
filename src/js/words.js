function initialParse(){
    $.getJSON('js/config.json',function(json){
        for(var i = 0; i < json['words'].length; i++){
            var word = json['words'][i]['word'];
            var def = json['words'][i]['def'];

            $("#wordbank_list").append('<li id="word_'+(i+1)+'" text="'+word+'">'+word+'</li>');

            $("#response .items-words").sortable({
                connectWith: "#wordbank_list",
                over: function() {
                    removeIntent = false;
                },
                out: function() {
                    removeIntent = true;
                },
                beforeStop: function (event, ui) {
                    if(removeIntent){
                        ui.item.remove();
                    }
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
initialParse();
