let debug = require('debug')('game:engine/input/utils/Keyboard');

let Keyboard = {
    _pressed: {},

    CTRL: 17,
    SPACE: 32,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    TAB: 9,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    E: 69,
    R: 82,
    X: 88,
    Z: 90,

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event) {
        if (this._previousKey !== event.keyCode) {
            this._previousKey = event.keyCode;
        }

        this._pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        this._pressed[event.keyCode] = false;
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
