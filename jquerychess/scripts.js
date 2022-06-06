/* vars */
const FIGURESYMBOL = {
    king: {
        white: '&#9812;',
        black: '&#9818;'
    },
    queen: {
        white: '&#9813;',
        black: '&#9819;'
    },
    rook: {
        white: '&#9814;',
        black: '&#9820;'
    },
    bishop: {
        white: '&#9815;',
        black: '&#9821;'
    },
    knight: {
        white: '&#9816;',
        black: '&#9822;'
    },
    pawn: {
        white: '&#9817;',
        black: '&#9823;'
    }
};
const FIGURESET = [];

/* functions */
function getCellSelector(cellName) {
    const letters = '  abcdefgh';
    return `.tr:nth-child(${10 - cellName[1]}) .td:nth-child(${letters.indexOf(cellName.toLowerCase()[0])})`;
}

function ChessFigure(name, color, position) {
    this.name = name;
    this.color = color;
    this.position = position;
}

function renderFigure(fig) {
    $(getCellSelector(fig.position)).html(FIGURESYMBOL[fig.name][fig.color]);
}

/* main */
$(function(){
    $('.td').click(function(){
        if ($('.start').length) {
            if ($('.finish').length) {
                $('.start').removeClass('start');
                $('.finish').removeClass('finish');
                $(this).addClass('start');
            } else {
                if ($(this).hasClass('start')) {
                    $(this).removeClass('start');
                } else {
                    $(this).addClass('finish');
                }
            }
        } else {
            $(this).addClass('start');
        }
    });
    
    // TODO - надо расставить фигуры из массива строк вида "king black e8".
    
});
