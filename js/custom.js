require.config({
    paths: {
        "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jquery-ui": "bower_components/jquery-ui/ui/jquery-ui",
        "videojs": "bower_components/video.js/dist/video-js/video",
        "imagesloaded": "bower_components/imagesloaded/imagesloaded",
        "eventEmitter/EventEmitter": "bower_components/eventEmitter/EventEmitter",
        "eventie/eventie": "bower_components/eventie/eventie",
        "modernizr": "bower_components/modernizr/modernizr",
        "state-machine": "bower_components/javascript-state-machine/state-machine.min"
    },
    shim: {
        "videojs": {exports: 'videojs'}
    }
});

require(['BigVideo'], function(bigvideo) {
  $(function() {
      var BV = new $.BigVideo({useFlashForFirefox:false});
      BV.init();
      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
      BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});

      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () {$('#big-video-wrap').fadeIn(1200)});

      // Hides logo, shows navbar
      $( document ).ready(function() {

        $('.bv-ctrl').on('click', function(e) {

          e.preventDefault();

          switch (this.id) {

            case 'btn-fr':

              // Fades out the logo then plays the next video with the french navbar sliding from top.
              $('#splash').fadeOut(1000, function () {
                $('#navbar-fr').show().animate({top: 0}, 800);
              });
              break;

            case 'btn-en':

              // Fades out the logo then plays the next video with the english navbar sliding from top.
              $('#splash').fadeOut(1000, function () {
                $('#navbar-en').show().animate({top: 0}, 800);
              });
              break;

            case 'nav-team':

              // Goes back to the initial loop, and display the team page.
              if (!$('#team-page').is(":visible")) {
                $('.page').fadeOut(600, function () {

                    console.log('Showing team NOW !');
                    $('#team-page').show();

                });
              };
              break;

            case 'nav-about':

              // Goes back to the initial loop, and display the contact form.
              $('.page').fadeOut(600, function () {
                BV.getPlayer().on("ended", function(){
                  BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:false});
                });
              });
              break;

            case 'btn-benjamin':

              BV.show('./videos/fecine-elevator-nothing2ben.webmhd.webm',{ambient:false});
              BV.getPlayer().on("ended", function(){
                BV.show('./videos/fecine-elevator-benloop.webmhd.webm',{ambient:false});
              });
              break;

            case 'btn-marc-antoine':

              BV.show('./videos/fecine-elevator-nothing2marco.webmhd.webm',{ambient:false});
              BV.getPlayer().on("ended", function(){
                BV.show('./videos/fecine-elevator-marcoloop.webmhd.webm',{ambient:false});
              });
              break;

            case 'btn-team-back':

              BV.getPlayer().on("ended", function(){
                BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:false});
              });
              break;

            default:
              $('.page').fadeOut(600, function () {});
              console.log('no action set for ' + this.id);
              $('.page').fadeOut(600, function () {});
          };
        });

      });
  });
});

function do_nothing(){

}