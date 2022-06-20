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
    
    if ($('.table').length) {
        getCurrency1();
        getCurrency2();
        getCurrency3();
        writeTable();
        $(document).on('click', '.quantity button:first-child', function(){
            let id = $(this).parents('.tr').find('.id').prop('id').slice(6);
            for (item of tovardata) {
                if (item.id == id) {
                    item.qty--;
                    if (item.qty <= 0) removeTovar(id);
                    break;
                }
            }
            writeTable();
        });
        $(document).on('click', '.quantity button:last-child', function(){
            let id = $(this).parents('.tr').find('.id').prop('id').slice(6);
            for (item of tovardata) {
                if (item.id == id) {
                    item.qty++;
                    break;
                }
            }
            writeTable();
        });
        $(document).on('click', '.delete button', function(){
            let id = $(this).parents('.tr').find('.id').prop('id').slice(6);
            if (removeTovar(id)) writeTable();
        });
        $('.form form').submit(function(e){
            e.preventDefault();
            formValidate(this);
        });
        $('#date').focus(function(){
            getCalendar($('#date').val());
        });
    }
    
    $('.totop').click(function(){
        $('html').animate({scrollTop: 0}, 1000);
    });
    
    $(window).scroll(function(){
        if ($(window).scrollTop() > 150) {
            $('.totop').removeClass('hidden');
        } else {
            $('.totop').addClass('hidden');
        }
    });
    $(window).trigger('scroll');
    
    $(window).on('storage', function(){
        if (localStorage.getItem('addTovar')) {
            let sum = 0;
            for (item of JSON.parse(localStorage.getItem('addTovar'))) {
                sum += item.qty
            }
            $('header .order span').html(sum).removeClass('hidden');
        } else {
            $('header .order span').html(0).addClass('hidden');
        }
    });
    $(window).trigger('storage');
    
});