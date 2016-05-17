// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
$(function() {

    function historyStoreTrack() {
        var track = $('#playlist li.active').text();
        var played = $('.player-played').text();

        var post = {'track': track, 'played': played, 'type': 0};

        $.ajax({
          type: "POST",
          url: '/history.php',
          data: JSON.stringify(post),
          dataType: 'json'
        });
    }

    function historyEndTrack() {
        var track = $('#playlist li.active').text();
        var played = $('.player-played').text();

        var post = {'track': track, 'played': played, 'type': 1};

        $.ajax({
          type: "POST",
          url: '/history.php',
          data: JSON.stringify(post),
          dataType: 'json'
        });
    }

    audiojs.events.ready(function() {
        var audios = document.getElementsByTagName('audio');
        window.player = audiojs.create(audios[0], {
            trackEnded: function() {
                if($('#playlist li.active').next().hasClass('list-item')) {

                    var item = $('#playlist li.active');
                    $(item).removeClass('active');
                    $(item).next().addClass('active');
                    window.player.load($(item).next().find('a').attr('data-src'));
                    window.player.play();
                    historyStoreTrack();
                }
            },
            css: false,
            createPlayer: {
                markup: '\
                  <div class="play-pause"> \
                    <p class="play"></p> \
                    <p class="pause"></p> \
                    <p class="loading"></p> \
                    <p class="error"></p> \
                  </div> \
                  <div class="player-scrubber"> \
                    <div class="player-progress"></div> \
                    <div class="player-loaded"></div> \
                  </div> \
                  <div class="player-time"> \
                    <em class="player-played">00:00</em>/<strong class="player-duration">00:00</strong> \
                  </div> \
                  <div class="error-message"></div>',
                playPauseClass: 'play-pause',
                scrubberClass: 'player-scrubber',
                progressClass: 'player-progress',
                loaderClass: 'player-loaded',
                timeClass: 'player-time',
                durationClass: 'player-duration',
                playedClass: 'player-played',
                errorMessageClass: 'error-message',
                playingClass: 'playing',
                loadingClass: 'loading',
                errorClass: 'error'
            }
        });

        window.player.load($('#playlist a').first().attr('data-src'));
        $('#playlist li').first().addClass('active');

        $('.player-play').click(function() {

            if($(this).find('i').hasClass('fa-play')) {
                $(this).find('i').removeClass('fa-play').addClass('fa-pause');
                $(this).addClass('player-stop');
                window.player.play();

                historyStoreTrack();
            } else {
                $(this).find('i').removeClass('fa-pause').addClass('fa-play');
                $(this).removeClass('player-stop');
                window.player.pause();

                historyEndTrack();
            }
        });

        function bindPlaylistItems() {

            $('.player-list .list-item').click(function() {

                historyEndTrack();

                $('.player-list .list-item').removeClass('active');
                $(this).addClass('active');
                $('.player-play').find('i').removeClass('fa-play').addClass('fa-pause');
                $('.player-play').addClass('player-stop');
                window.player.load($(this).find('a').attr('data-src'));
                window.player.play();
                historyStoreTrack();

                return false;
            });
        }

        bindPlaylistItems();

        $('.player-forward').click(function() {

            if($('#playlist li.active').next().hasClass('list-item')) {

                historyEndTrack();

                var item = $('#playlist li.active');
                $(item).removeClass('active');
                $(item).next().addClass('active');
                $('.player-play').find('i').removeClass('fa-play').addClass('fa-pause');
                $('.player-play').addClass('player-stop');
                window.player.load($(item).next().find('a').attr('data-src'));
                window.player.play();
                historyStoreTrack();
            }
        });

        $('.player-rewind').click(function() {

            if($('#playlist li.active').prev().hasClass('list-item')) {

                historyEndTrack();

                var item = $('#playlist li.active');
                $(item).removeClass('active');
                $(item).prev().addClass('active');
                $('.player-play').find('i').removeClass('fa-play').addClass('fa-pause');
                $('.player-play').addClass('player-stop');
                window.player.load($(item).prev().find('a').attr('data-src'));
                window.player.play();
                historyStoreTrack();
            }
        });

        $('.gallery-item-play').click(function() {

            historyEndTrack();

            $('#playlist').html($('#'+$(this).attr('data-playlist')).html());
            $('#playlist li').first().addClass('active');
            $('.player-play').find('i').removeClass('fa-play').addClass('fa-pause');
            $('.player-play').addClass('player-stop');
            window.player.load($('#playlist a').first().attr('data-src'));
            window.player.play();
            historyStoreTrack();

            bindPlaylistItems();
        });

        $(window).on("beforeunload", function() { 
            historyEndTrack();
        });
    });

    $('.player-playlist').click(function() {

        if($('.player-list').css('display') == 'block') {

            $('.player-list').fadeOut(400);
        } else {

            $('.player-list').fadeIn(400);
        }
    });

});