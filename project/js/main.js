$(function(){
    if ($('.retaimer').length) {
        retimer();
        setInterval(retimer, 500);
    }
    
    // $('.retaimer').each(function() {
        // retimer();
        // setInterval(retimer, 500);
    // });
    
    if ($('.slider_block').length) {
        slideFlag['slider'] = false;
        slidePointer['slider'] = 0;
        setInterval(function(){
            sliderRun('slider', 'toleft');
        }, 5000);
        $('.slider .to_left').click(function(){
            sliderRun('slider', 'toleft');
        });
        $('.slider .to_right').click(function(){
            sliderRun('slider', 'toright');
        });
        $('.slider_points span').click(function(){
            let direction = $('.slider_points span').index(this);
            if (!$(this).hasClass('active')) sliderRun('slider', direction);
        })
    }
    
    if ($('.catmenu').length) {
        $('.catmenu .opener').click(function(){
            $('.catmenu').toggleClass('open')
        });
        $('.accordeon .sub').click(function(){
            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
            } else {
                $('.accordeon .sub.open').removeClass('open');
                $(this).addClass('open');
            }
        });
        $('.accordeon .sub > a').click(function(e){
            e.stopPropagation();
        });
    }
    
    $('.item').click(function(){
        if ($(this).data('href')) location.assign($(this).data('href'));
    })
    
    if ($('.product').length) {
        $('.mini .rail').css({width: $('.mini .rail img').length * 60 - 10});
        
        $('.bigimage img').click(function(){
            lightbox(this);
        });
        
        $('.gal_left').click(function(){
            if (!$(this).hasClass('disabled')) galSlide('left');
        });
        $('.gal_right').click(function(){
            if (!$(this).hasClass('disabled')) galSlide('right');
        });
        
        $('.rail img').click(function(){
            let attr = $(this).attr('src').split('/');
            attr = attr[0] + '/' + attr[1].split('_')[1];
            $('.bigimage img').attr('src', attr);
        });
    }
    
    
    
    
    
    
    
    
});