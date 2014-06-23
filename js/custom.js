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

require(['BigVideo', 'state-machine'], function(bigvideo, StateMachine) {
  
  BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();
  // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
  // BV.getPlayer().on("ended", function () {console.log('playback: video ended')});

  BG = function() {

    handle_hiding = function () {

      $('.hideable').each(function( i ) {

        var attrib = $(this).attr('onclick');
        var action =  attrib.slice(3,-3) || ''; // Assuming "BG.action();"
        
        if ( fsm.cannot(action) ) {
          $(this).fadeOut(400);
        } else {
          $(this).fadeIn(800);
        }
      });
    }

    pause = function (name) {
      BV.getPlayer().pause();
    }

    play = function (name) {

      if (!name) {
        BV.getPlayer().pause();
        return;
      }

      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
      BV.show('./videos/' + name + '.webmhd.webm',{altSource:'./videos/' + name + '.mp4', ambient:true});
    }

    transition = function (name) {

      BV.getPlayer().one("ended", function () {
        // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
        BV.show('./videos/' + name + '.webmhd.webm',{altSource:'./videos/' + name + '.mp4', ambient:true});
      });
    }


    var fsm = StateMachine.create({

      events: [

        { name: 'clickmenu',  from: ['*'],              to: 'menu'  },
        { name: 'clickprod',  from: ['*'],              to: 'prod'  },
        { name: 'clickteam',  from: ['*'],              to: 'team'  },
        { name: 'clickabout', from: ['*'],              to: 'about' },
        { name: 'clicklang',  from: ['none'],           to: 'about' },
        { name: 'clickben',   from: ['team'],           to: 'ben'   },
        { name: 'clickmarco', from: ['team'],           to: 'marco' },
        { name: 'clickback',  from: ['marco', 'ben'],   to: 'team'  },

      ],

      callbacks: {
        onclicklang: function (event, from, to) {
          // Fades in the video once it is ready. hides the flickering in the beginning.
          $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(1200) });
        },


        onmenu:      function (event, from, to) {
          play('fecine-forestloop');
        },

        onenterprod:      function (event, from, to) {
          $('#production-page').hide().removeClass('hidden').fadeIn(600);
          $('#video-mask').hide().removeClass('hidden').fadeIn(600);
          pause();
        },
        onleaveprod:      function (event, from, to) {
          $('#production-page').fadeOut(600).hide().addClass('hidden');
          $('#video-mask').fadeOut(600).hide().addClass('hidden');
          console.log('video-mask: hidden !!');
          play();
        },

        onenterteam: function (event, from, to) {
          if (from != 'ben' && from != 'marco' ) {
          
            play('fecine-elevator-nothingloop');
            $('#team-page').removeClass('hidden').hide().fadeIn(600);
          
          } else {
          
            transition('fecine-elevator-nothingloop');
          }
        },
        onteam:      function (event, from, to) {
          console.log('team');
        },


        onabout: function (event, from, to) {
          play('fecine-forestloop');
        },


        /* Handles MARCO related events */
        onentermarco: function (event, from, to) {
          play('fecine-elevator-nothing2marco');
          transition('fecine-elevator-marcoloop');
        },
        onleavemarco:  function (event, from, to) {
          play('fecine-elevator-marco2nothing');
        },


        /* Handles BEN related events */
        onenterben:   function (event, from, to) {
          play('fecine-elevator-nothing2ben');
          transition('fecine-elevator-benloop');
        },
        onleaveben:    function (event, from, to) {
          console.log('playback: leaving ben.');
          play('fecine-elevator-ben2nothing');
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