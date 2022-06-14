let slideFlag = {};
let slidePointer = {};
let galFlag = false;

function retimer() {
    let limit = new Date($('.retaimer').data('fordate'));
    let now = new Date();
    let delta = Math.floor((limit.getTime() - now.getTime()) / 1000);
    if (delta < 0) delta = 0;
    let sec = delta % 60;
    $('.retaimer .num').eq(3).html(`${addChar(sec)}<span class="subnum">${multiple(sec, ['секунда', 'секунды', 'секунд'])}</span>`);
    delta = Math.floor(delta / 60);
    let minute = delta % 60;
    $('.retaimer .num').eq(2).html(`${addChar(minute)}<span class="subnum">${multiple(minute, ['минута', 'минуты', 'минут'])}</span>`);
    delta = Math.floor(delta / 60);
    let hour = delta % 24;
    $('.retaimer .num').eq(1).html(`${addChar(hour)}<span class="subnum">${multiple(hour, ['час', 'часа', 'часов'])}</span>`);
    delta = Math.floor(delta / 24);
    $('.retaimer .num').eq(0).html(`${delta}<span class="subnum">${multiple(delta, ['день', 'дня', 'дней'])}</span>`);
}

function addChar(c) {
    c += '';
    if (c.length < 2) {
        c = '0' + c;
    }
    return c;
}

function multiple(num, words) {
    num = num % 100;
    if (Math.floor(num / 10) != 1) {
        if (num % 10 == 1) {
            return words[0];
        } else if ((num % 10 > 1) && (num % 10 < 5)) {
            return words[1];
        }
    }
    return words[2];
}

function sliderRun(slideclass, direction) {
    if (slideFlag[slideclass]) return;
    slideFlag[slideclass] = true;
    let selector = '.' + slideclass + '_block';
    let width = $(selector + '.active').width();
    let next, anim;
    if (direction == 'toright') {
        next = slidePointer[slideclass] - 1;
        if (next < 0) next += $(selector).length;
        anim = '+=' + width;
        width = -width;
    } else if (direction == 'toleft') {
        next = slidePointer[slideclass] + 1;
        if (next > $(selector).length - 1) next -= $(selector).length;
        anim = '-=' + width;
    } else {
        next = direction;
        anim = '-=' + width;
    }
    slidePointer[slideclass] = next;
    $(selector + '.active').addClass('eliminate');
    $(selector).eq(next).css('left', width + 'px').addClass('active');
    $(selector + '.active').animate({left: anim}, 1000, function() {
        $(selector + '.eliminate').removeClass('active').removeClass('eliminate');
        $('.slider_points span').removeClass('active').eq(next).addClass('active');
        slideFlag[slideclass] = false;
    });
}

function lightbox(aim){
    let src = $(aim).attr('src').split('/');
    src = src[0] + '/big_' + src[1];
    let w = document.documentElement.clientWidth - 64;
    let h = document.documentElement.clientHeight - 64;
    let sides = aim.clientWidth / aim.clientHeight;
    if (w > sides * h) {
        w = sides * h;
    } else if (w < sides * h) {
        h = Math.floor(w / sides);
    }
    let topfix = h / 2 + 16;
    let leftfix = w / 2 + 16;
    hlpstr = '<div class="lightbox" style="margin-left:-' + leftfix + 'px;margin-top:-' + topfix + 'px;"><button type="button">&times;</button><img src="' + src + '" style="width:' + w + 'px;height:' + h + 'px;"></div>';
    $('body').append('<div class="screen"></div>');
    $('body').append(hlpstr);
    $('.lightbox button, .screen').click(function(){
        $('.lightbox').animate({opacity:0}, 500, function(){
            $('.lightbox').remove();
            $('.screen').remove();
        });
    });
    $('.lightbox').animate({opacity:1}, 500);
}

function galSlide(direction) {
    if (galFlag) return;
    galFlag = true;
    let hlpstr = parseInt($('.rail').css('left'));
    if (direction == 'left') {
        hlpstr -= 60;
    } else {
        hlpstr += 60;
    }
    $('.rail').animate({
        left: hlpstr
    }, 500, function(){
        let l = parseInt($('.rail').css('left'));
        if (l == 0) {
            $('.gal_right').addClass('disabled');
        } else {
            $('.gal_right').removeClass('disabled');
        }
        if ($('.rail').width() + l == 410) {
            $('.gal_left').addClass('disabled');
        } else {
            $('.gal_left').removeClass('disabled');
        }
        galFlag = false;
    });
}

function writeTable() {
    // проверяем длину tovardata. если там пусто, удаляем .table и .form, добавляем .empty с текстом "Ваша корзина пуста".
    if (!tovardata.length) {
        $('.table, .form').remove();
        $('h1').after('<div class="empty">Ваша корзина пуста!</div>');
        return;
    }
    let tab = $('.table');
    let hlpstr = '<div class="tr top"><div class="id">№</div><div class="name">Наименование</div><div class="price">Цена</div><div class="quantity">Количество</div><div class="summa">Сумма</div><div class="delete"></div></div>';
    let sum = 0;
    for (item of tovardata) {
        sum += (item.qty * item.price);
        hlpstr += '<div class="tr"><div class="id" id="tovar_' + item.id + '">1</div><div class="name">' + item.name + '</div><div class="price">' + item.price + '</div><div class="quantity"><button type="button">&minus;</button><span class="number">' + item.qty + '</span><button type="button">&plus;</button></div><div class="summa">' + (item.qty * item.price) + '</div><div class="delete"><button type="button">&times;</button></div></div>';
    }
    hlpstr += '<div class="tr bottom"><div class="text">Итого:</div><div class="itog">' + sum + '</div></div>';
    tab.html(hlpstr);
}

function removeTovar(id) {
    for (let i = 0; i < tovardata.length; i++) {
        if (tovardata[i].id == id) {
            tovardata.splice(i, 1);
            return true;
        }
    }
    return false;
}


