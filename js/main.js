$(function() {
	$('.logotype-scroll-down').click(function() {
		$('body,html').animate({
            scrollTop: $('.gallery').offset().top
        }, 800);
	});

	$(window).scroll(function() {
        if ($(this).scrollTop() > $('.logotype-container').height()/2) {
            $('footer').fadeIn();
        } else {
            $('footer').fadeOut();
        }
    });

    $('.gallery-item-show').click(function() {

    	$('#'+$(this).attr('data-article')).css('top', $(this).parent().parent().offset().top);
    	$('#'+$(this).attr('data-article')).fadeIn(400);
    });

    $('.article-item-close').click(function() {
    	$(this).parent().fadeOut(400);
    });
});