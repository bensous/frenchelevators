require.config({
    baseUrl: 'bower_components',
    paths: {
        "BigVideo": "BigVideo.js/lib/bigvideo",
        "jquery": "jquery/dist/jquery.min",
        "jquery-ui": "jquery-ui/jquery-ui.min",
        "videojs": "video.js/dist/video-js/video",
        "imagesloaded": "imagesloaded/imagesloaded",
        "eventEmitter/EventEmitter": "eventEmitter/EventEmitter",
        "eventie/eventie": "eventie/eventie",
        "modernizr": "modernizr/modernizr",
        "state-machine": "javascript-state-machine/state-machine",
        "fitvids": "fitvids/jquery.fitvids",
        "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
    },
    shim: {
        "videojs": {exports: "videojs"},
        "fitvids": ["jquery"],
        "BigVideo": ["jquery"],
    }
});

require(['fitvids'], function(FitVids) {
  $(".fluid-width-video-wrapper").fitVids();

});

require(['BigVideo', 'state-machine', 'modernizr'], function(bigvideo, StateMachine, modernizr) {
  
  BV = new $.BigVideo({useFlashForFirefox:false});
  BV.init();
  // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{ambient:true});
  // BV.getPlayer().on("ended", function () {console.log('playback: video ended')});
  // BV.getPlayer().on("ready", function () {console.log('playback: video is playing !')});

  BG = function() {

    handle_hiding = function () {

      $('.hideable').each(function( i ) {
        
        // Hides the element if it does not belong to the state
        if ( !$(this).hasClass(fsm.current) ) {
          $(this).fadeOut(500).addClass('hidden').hide();
        }
      });
    }

    handle_showing = function () {

      // Shows the element if it belongs to the state
      $('.hideable').each(function( i ) {
        
        if ( $(this).hasClass(fsm.current) ) {
          $(this).hide().removeClass('hidden').fadeIn(800);
        }

      });
      
      console.log('handle_showing: end.');
    }

    toggle_navbar = function (lang) {

      // Sets the document language.
      document.documentElement.lang = lang;
      
      // Fades out the logo with the french navbar sliding from top.
      $('#splash').fadeOut(600, function () {
        $('#navbar-' + lang ).show().animate({top: 0}, 800);
      });
    }

    toggle_video = function () {
      
      // Fades in the video once it is ready. hides the flickering in the beginning.
      $('#big-video-wrap').hide().ready(function () { $('#big-video-wrap').fadeIn(600, handle_showing); });
    }

    pause = function () {
      BV.getPlayer().pause();
    }

    show = function (name, callback) {

      if (Modernizr.touch) {
        // If it is a touch device, just shows a picture, does not play the video
        BV.show('./videos/' + name + '.mp4.jpg');
      } else {
        
        shouldFade = !(name.indexOf("fecine-elevator") > -1) && !(name.indexOf("fecine-elevator-nothingloop") > -1);

        if (shouldFade) {$('#big-video-wrap').hide();};
        
        // BV.show('./videos/fecine-elevator-nothingloop.webmhd.webm',{altSource:'./videos/fecine-elevator-nothingloop.mp4',ambient:true});
        BV.show('./videos/' + name + '.webmhd.webm', {altSource:'./videos/' + name + '.mp4', ambient:true, doLoop:true});
        
        if (shouldFade) {$('#big-video-wrap').ready(function () { $('#big-video-wrap').fadeIn(800); }); };
        
        console.log("BV.show('./videos/" + name + ".webmhd.webm');");
      }

      if (callback instanceof Function) {

        if (Modernizr.touch) {
          callback();
        } else {
          BV.getPlayer().one("play", callback);
        }
      }
    }

    play = function (name, callback) {

      if (!name) {
        BV.getPlayer().play();
        return;
      }

      show(name, callback);
    }

    queue = function (name, callback) {

      BV.getPlayer().one("ended", function () {show(name, callback);});
    }


    var fsm = StateMachine.create({

      events: [

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
        },
        onclicklangen: function (event, from, to) {
          toggle_navbar("en");
        },


        onenterabout: function (event, from, to) {
          if (from == 'none') {
            toggle_video();
            play('fecine-forestloop');
          } else {
            play('fecine-forestloop', handle_showing);
          }
        },
        onleaveabout:      function (event, from, to) {
        },


        onenterprod:      function (event, from, to) {
          play('fe-oldfilmblack', handle_showing);
        },
        onleaveprod:      function (event, from, to) {
        },


        onentercontact:      function (event, from, to) {
          $('#video-mask').hide().removeClass('hidden').fadeIn(600, function () {
            pause();
            handle_showing();
          });
        },
        onleavecontact:      function (event, from, to) {
          $('#video-mask').fadeOut(600).hide().addClass('hidden');
          play();
        },


        onenterteam: function (event, from, to) {
          if (from != 'ben' && from != 'marco' ) {
          
            play('fecine-elevator-nothingloop', handle_showing);
            
          } else {
          
            queue('fecine-elevator-nothingloop', handle_showing);
          }
        },
        onleaveteam:      function (event, from, to) {
        },


        /* Handles MARCO related events */
        onentermarco: function (event, from, to) {
          play('fecine-elevator-nothing2marco');
          queue('fecine-elevator-marcoloop', handle_showing);
        },
        onleavemarco:  function (event, from, to) {
          play('fecine-elevator-marco2nothing');
        },


        /* Handles BEN related events */
        onenterben:   function (event, from, to) {
          play('fecine-elevator-nothing2ben');
          queue('fecine-elevator-benloop', handle_showing);
        },
        onleaveben:    function (event, from, to) {
          play('fecine-elevator-ben2nothing');
        },


        onchangestate: function(event, from, to) {
          console.log("CHANGED STATE: " + from + " to " + to);
          
            handle_hiding();
        }
      }
    });

    return fsm;

  }();
});