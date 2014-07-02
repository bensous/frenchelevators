require.config({
    paths: {
        "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jquery-ui": "bower_components/jquery-ui/jquery-ui.min",
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

require(['BigVideo', 'state-machine', 'modernizr'], function(bigvideo, StateMachine, modernizr) {
  
  BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();
  // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
  // BV.getPlayer().on("ended", function () {console.log('playback: video ended')});

  BG = function() {

    handle_hiding = function () {

      $('.hideable').each(function( i ) {
        
        // Hides the element if it does not belong to the state
        if ( $(this).hasClass(fsm.current) ) {
          $(this).fadeIn(800);
        } else {
          $(this).fadeOut(300);
        }
      });
    }

    toggle_navbar = function (lang) {

      // Sets the document language.
      document.documentElement.lang = lang;
      
      // Fades out the logo with the french navbar sliding from top.
      $('#splash').fadeOut(1000, function () {
        $('#navbar-' + lang ).show().animate({top: 0}, 800);
      });
    }

    toggle_video = function () {
      
      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(1200) });
    }

    pause = function () {
      BV.getPlayer().pause();
    }

    show = function (name) {

      if (Modernizr.touch) {
        // If it is a touch device, just shows a picture, does not play the video
        BV.show('./videos/' + name + '.mp4.jpg');
      } else {
      // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
        BV.show('./videos/' + name + '.webmhd.webm',{altSource:'./videos/' + name + '.mp4', ambient:true});
      }
    }

    play = function (name) {

      if (!name) {
        BV.getPlayer().pause();
        return;
      }

      show(name);
    }

    queue = function (name) {

      BV.getPlayer().one("ended", function () {show(name);});
    }


    var fsm = StateMachine.create({

      events: [

        { name: 'clickmenu',    from: ['*'],            to: 'menu'    },
        { name: 'clickprod',    from: ['*'],            to: 'prod'    },
        { name: 'clickteam',    from: ['*'],            to: 'team'    },
        { name: 'clickabout',   from: ['*'],            to: 'about'   },
        { name: 'clickcontact', from: ['*'],            to: 'contact' },
        { name: 'clicklangfr',  from: ['none'],         to: 'about'   },
        { name: 'clicklangen',  from: ['none'],         to: 'about'   },
        { name: 'clickben',     from: ['team'],         to: 'ben'     },
        { name: 'clickmarco',   from: ['team'],         to: 'marco'   },
        { name: 'clickback',    from: ['marco', 'ben'], to: 'team'    },

      ],

      callbacks: {
        onclicklangfr: function (event, from, to) {
          toggle_navbar("fr");
          toggle_video();
        },
        onclicklangen: function (event, from, to) {
          toggle_navbar("en");
          toggle_video();
        },


        onmenu:      function (event, from, to) {
          play('fecine-forestloop');
        },

        onenterprod:      function (event, from, to) {
          $('#production-page').hide().removeClass('hidden').fadeIn(600);
          play('fe-oldfilmblack');
        },
        onleaveprod:      function (event, from, to) {
          $('#production-page').fadeOut(600).hide().addClass('hidden');
        },

        onentercontact:      function (event, from, to) {
          $('#contact-page').hide().removeClass('hidden').fadeIn(600);
          $('#video-mask').hide().removeClass('hidden').fadeIn(600);
          pause();
        },
        onleavecontact:      function (event, from, to) {
          $('#contact-page').fadeOut(600).hide().addClass('hidden');
          $('#video-mask').fadeOut(600).hide().addClass('hidden');
          play();
        },

        onenterteam: function (event, from, to) {
          if (from != 'ben' && from != 'marco' ) {
          
            play('fecine-elevator-nothingloop');
            $('#team-page').removeClass('hidden').hide().fadeIn(600);
          
          } else {
          
            queue('fecine-elevator-nothingloop');
          }
        },
        onleaveteam:      function (event, from, to) {
          console.log('team');
        },


        onenterabout: function (event, from, to) {
          $('#about-page').hide().removeClass('hidden').fadeIn(600);
          play('fecine-forestloop');
        },
        onleaveabout:      function (event, from, to) {
          $('#about-page').fadeOut(600).hide().addClass('hidden');
        },


        /* Handles MARCO related events */
        onentermarco: function (event, from, to) {
          play('fecine-elevator-nothing2marco');
          queue('fecine-elevator-marcoloop');
        },
        onleavemarco:  function (event, from, to) {
          play('fecine-elevator-marco2nothing');
        },


        /* Handles BEN related events */
        onenterben:   function (event, from, to) {
          play('fecine-elevator-nothing2ben');
          queue('fecine-elevator-benloop');
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
});