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
        "state-machine": "bower_components/javascript-state-machine/state-machine"
    },
    shim: {
        "videojs": {exports: 'videojs'}
    }
});

require(['state-machine'], function(StateMachine) {
  
});

require(['BigVideo', 'state-machine'], function(bigvideo, StateMachine) {
  
  BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();
  BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
  // BV.getPlayer().on("ended", function () {console.log('playback: video ended')});

  BG = function() {

    handle_hiding = function () {

      $('.hideable').each(function( i ) {

        var attrib = $(this).attr('onclick');
        var action =  attrib.slice(3,-3); // Assuming "BG.action();"
        
        if ( fsm.cannot(action) ) {
          $(this).hide(400);
        } else {
          $(this).show(400);
        }
      });

    }

    var fsm = StateMachine.create({
      initial: 'menu',

      events: [
        { name: 'clickben',   from: ['team'],                  to: 'ben'   },
        { name: 'clickmarco', from: ['team'],                  to: 'marco' },
        { name: 'clickteam',  from: ['menu', 'about'],         to: 'team'  },
        { name: 'clickback',  from: ['marco', 'ben'],          to: 'team'  },

        { name: 'clickabout', from: ['marco', 'ben', 'team', 'menu', 'about'], to: 'about' },
        { name: 'clickmenu',  from: ['marco', 'ben', 'team', 'menu', 'about'], to: 'menu'  },
      ],

      callbacks: {
        onmenu:      function (event, from, to) {
          BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});          
        },


        onenterteam: function (event, from, to) {
          if (from != 'ben' && from != 'marco' ) {
            BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
            $('#team-page').hide().fadeIn(600);
          } else {
            BV.getPlayer().one("ended", function () {
              BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
            });
          }
          ;
        },
        onteam:      function (event, from, to) {
          console.log('team');
        },


        onabout: function (event, from, to) {
          BV.show('./videos/fecine-forestloop.webmhd.webm',{ambient:true});
          $('.page').fadeOut(600, function () {
            console.log('waiting for video to end before playing fecine-forestloop.');
            BV.getPlayer().one("ended", function(){
            });
          });
        },


        /* Handles MARCO related events */
        onentermarco: function (event, from, to) {
          BV.show('./videos/fecine-elevator-nothing2marco.webmhd.webm',{ambient:false});

          BV.getPlayer().one("ended", function () {
            BV.show('./videos/fecine-elevator-marcoloop.webmhd.webm',{ambient:true});
          }); 
        },
        onleavemarco:  function (event, from, to) {
          console.log('playback: leaving marco.'); // For some reasons, it never gets printed to the console.
          BV.show('./videos/fecine-elevator-marco2nothing.webmhd.webm',{ambient:false});
        },


        /* Handles BEN related events */
        onenterben:   function (event, from, to) {
          BV.show('./videos/fecine-elevator-nothing2ben.webmhd.webm',{ambient:false});

          BV.getPlayer().one("ended", function () {
            BV.show('./videos/fecine-elevator-benloop.webmhd.webm',{ambient:true});
          });
        },
        onleaveben:    function (event, from, to) {
          console.log('playback: leaving ben.'); // For some reasons, it never gets printed to the console.
          BV.show('./videos/fecine-elevator-ben2nothing.webmhd.webm',{ambient:false});
        },


        onchangestate: function(event, from, to) {
          console.log("CHANGED STATE: " + from + " to " + to);
          
          if (from != 'none') {
            handle_hiding();
          }
        }
      }
    });

    return fsm;

  }();

  $(function() {

      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});

      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(1200) });

      $( document ).ready(function() {

        $('.bv-ctrl').on('click', function(e) {

          switch (this.id) {

            case 'btn-fr':
              e.preventDefault();

              // Fades out the logo with the french navbar sliding from top.
              document.documentElement.lang = "fr";
              $('#splash').fadeOut(1000, function () {
                $('#navbar-fr').show().animate({top: 0}, 800);
              });
              break;

            case 'btn-en':
              e.preventDefault();

              // Fades out the logo with the english navbar sliding from top.
              document.documentElement.lang = "en";
              $('#splash').fadeOut(1000, function () {
                $('#navbar-en').show().animate({top: 0}, 800);
              });
              break;

            default:
              console.log('no action set for ' + this.id);
          };
        });

      });
  });
});

function do_nothing(){

}