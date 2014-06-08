require.config({
    paths: {
        "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jquery-ui": "bower_components/jquery-ui/ui/jquery-ui",
        "videojs": "bower_components/video.js/dist/video-js/video",
        "imagesloaded": "bower_components/imagesloaded/imagesloaded",
        "eventEmitter/EventEmitter": "bower_components/eventEmitter/EventEmitter",
        "eventie/eventie": "bower_components/eventie/eventie",
        "modernizr": "bower_components/modernizr/modernizr"
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

      // Hides logo, shows navbar
      $( document ).ready(function() {

        $('.bv-ctrl').on('click', function(e) {

          e.preventDefault();

          switch (this.id) {

            case  'btn-fr':

              // Fades out the logo then plays the next video with the navbar sliding from top.
              $('#splash').fadeOut(1000, function () {

                BV.show('./videos/fecine-elevator-marcotonothingtrans.webmhd.webm',{ambient:false});
                
                $('#navbar-fr').show().animate({top: 0}, 800);
              });
              break;

            case  'btn-en':

              // Fades out the logo then plays the next video with the navbar sliding from top.
              $('#splash').fadeOut(1000, function () {

                BV.show('./videos/fecine-elevator-marcotonothingtrans.webmhd.webm',{ambient:false});
                
                $('#navbar-en').show().animate({top: 0}, 800);
              });
              break;

            default:

              console.log('no action for ' + this.id);
          };
        });

      });
  });
});

function do_nothing(){

}