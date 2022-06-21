let slideFlag = {};
let slidePointer = {};
let galFlag = false;
const russMonth = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

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

function lightbox(aim) {
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

function getCurrency1() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js');
    xhr.onreadystatechange = function() {
        if ((xhr.readyState == 4) && (xhr.status == 200)) {
            $('#currency1').html(JSON.parse(xhr.response).Valute.USD.Value.toFixed(2) + ' рублей за доллар');
        }
    };
    xhr.send();
}

function getCurrency2() {
    $.get('https://www.cbr-xml-daily.ru/daily_json.js', function(response){
        $('#currency2').html(JSON.parse(response).Valute.EUR.Value.toFixed(2) + ' рублей за евро');
    });
}

function getCurrency3() {
    fetch("https://www.cbr-xml-daily.ru/daily_json.js").then(response => response.json()).then(response => $('#currency3').html(response.Valute.CNY.Value.toFixed(2) + ' рублей за юань'));
}

function formValidate(form) {
    let name = $('#name').val();
    if (!name) {
        alert('Не заполнено имя!');
        return false;
    }
    let phone = $('#phone').val();
    if (!phone.match(/^((\+7)|(8))?\s?\(?\d{3}\)?\s?\d{3}\-?\d{2}\-?\d{2}$/)) {
        alert('Не заполнен номер телефона!');
        return false;
    }
    let mail = $('#mail').val();
    if (!mail.match(/^.+@.+\..+$/)) {
        alert('Не заполнен адрес почты!');
        return false;
    }
    let date = $('#date').val();
    if (!date.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
        alert('Не выбрана дата!');
        return false;
    }
    let comment = $('#comment').val();
    let formData = {
        name,
        phone,
        mail,
        date,
        comment
    }
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        data: formData,
        method: 'POST',
        success: function(response) {
            makeAlert(response);
        }
    });
}

function makeAlert(response) {
    let hlpstr = '<div class="alertbox"><button type="button">&times;</button><p>Ваш заказ оформлен под номером ' + response.id + '.</p></div>';
    $('body').append('<div class="screen"></div>');
    $('body').append(hlpstr);
    $('.alertbox button, .screen').click(function(){
        $('.alertbox').animate({opacity:0}, 500, function(){
            location.reload(true);
        });
    });
    $('.alertbox').animate({opacity:1}, 500);
}

function makeCalendar(fieldDate) {
    let hlpdate = new Date();
    let curyear, curmonth, curday;
    if (fieldDate.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
        [curday, curmonth, curyear] = fieldDate.split('-');
        curmonth--;
        hlpdate = new Date(curyear, curmonth, curday);
    }
    curyear = hlpdate.getFullYear();
    curmonth = hlpdate.getMonth();
    curday = hlpdate.getDate();
    /*
    if (fieldDate.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
        [curday, curmonth, curyear] = fieldDate.split('-');
        curmonth--;
        if ((curday < 1) || (curmonth < 0) || (curyear < 2020) || (curmonth > 11) || (curyear > 2023) || (curday > 31) || ((curmonth in [3, 5, 8, 10]) && (curday > 30)) || ((curmonth == 1) && ((curyear % 400 == 0) || ((curyear % 4 == 0) && (curyear % 100 != 0))) && (curday > 29)) || ((curmonth == 1) && (curday > 28))) {
            curyear = now.getFullYear();
            curmonth = now.getMonth();
            curday = now.getDate();
        }
    }
    */
    hlpdate = new Date(curyear, curmonth);
    let prevdays = ((hlpdate.getDay() + 6) % 7); // пн - 0, вт - 1 ... сб - 5, вс - 6
    hlpdate = new Date(curyear, curmonth + 1, 0);
    let lastday = hlpdate.getDate() + prevdays; // последний день месяца + дни до начала месяца
    let weeks = Math.ceil(lastday / 7);
    let hlpstr = '<div class="dp_header"><span class="bigprev"><<</span><span class="prev"><</span><strong>' + russMonth[curmonth] + ' ' + curyear + '</strong><span class="next">></span><span class="bignext">>></span></div>';
    hlpstr += '<div class="dp_grid"><span class="headday">Пн</span><span class="headday">Вт</span><span class="headday">Ср</span><span class="headday">Чт</span><span class="headday">Пт</span><span class="headday holiday">Сб</span><span class="headday holiday">Вс</span>';
    for (let i = 0; i < weeks * 7; i++) {
        if ((i >= prevdays) && (i < lastday)) {
            let getdate = addChar(i - prevdays + 1) + '-' + addChar(curmonth + 1) + '-' + curyear;
            hlpstr += '<span class="getter';
            if ((i % 7 == 5) || (i % 7 == 6)) hlpstr += ' holiday';
            hlpstr += '" data-get="' + getdate + '">' + (i - prevdays + 1) + '</span>';
        } else {
            hlpstr += '<span class="empty"></span>';
        }
    }
    hlpstr += '</div>';
    $('#calendar').html(hlpstr);
    $('#calendar .prev').click(function(){
        makeCalendar(`01-${addChar(curmonth)}-${curyear}`);
    })
    $('#calendar .next').click(function(){
        makeCalendar(`01-${addChar(curmonth + 2)}-${curyear}`);
    })
    $('#calendar .bigprev').click(function(){
        makeCalendar(`01-${addChar(curmonth + 1)}-${curyear - 1}`);
    })
    $('#calendar .bignext').click(function(){
        makeCalendar(`01-${addChar(curmonth + 1)}-${curyear + 1}`);
    })
    $('#calendar .getter').click(function(){
        $('#date').val(this.dataset.get);
        $('.calendarbox').animate({opacity:0}, 500, function(){
            $('.calendarbox').remove();
            $('.screen').remove();
        });
    });
}

function getCalendar(fieldDate) {
    if ($('.calendarbox').length) return;
    $('body').append('<div class="screen"></div>');
    $('body').append('<div class="calendarbox"><div id="calendar"></div></div>');
    $('.screen').click(function(){
        $('.calendarbox').animate({opacity:0}, 500, function(){
            $('.calendarbox').remove();
            $('.screen').remove();
        });
    });
    makeCalendar(fieldDate);
    $('.calendarbox').animate({opacity:1}, 500);
}

function addTovar(tovar){
    let basket = JSON.parse(localStorage.getItem('addTovar'));
    let flag = false;
    if (basket) {
        for (let i of basket) {
            if (i.id == tovar.id) {
                i.qty += tovar.qty;
                flag = true;
                break;
            }
        }
        if (!flag) basket.push(tovar);
    } else {
        basket = [tovar];
    }
    localStorage.setItem('addTovar', JSON.stringify(basket));
    $(window).trigger('storage');
}