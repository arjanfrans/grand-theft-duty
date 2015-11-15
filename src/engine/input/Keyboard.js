let debug = require('debug')('game:engine/input/utils/Keyboard');

let Keyboard = {
    _pressed: {},

    CTRL: 17,
    SPACE: 32,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function (event) {
    Keyboard.onKeyup(event);
    event.preventDefault();
}, false);

window.addEventListener('keydown', function (event) {
    Keyboard.onKeydown(event);
    event.preventDefault();
}, false);

export default Keyboard;
