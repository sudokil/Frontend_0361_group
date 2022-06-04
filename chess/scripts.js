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
    document.querySelector(getCellSelector(fig.position)).innerHTML = FIGURESYMBOL[fig.name][fig.color];
}

/* main */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.td').forEach(item => item.addEventListener('click', function(){
        if (document.querySelector('.start')) {
            if (document.querySelector('.finish')) {
                document.querySelector('.start').classList.remove('start');
                document.querySelector('.finish').classList.remove('finish');
                this.classList.add('start');
            } else {
                if (this.classList.contains('start')) {
                    this.classList.remove('start');
                } else {
                    this.classList.add('finish');
                }
            }
        } else {
            this.classList.add('start');
        }
    }));
    
    // TODO - надо расставить фигуры из массива строк вида "king black e8".
    
});
