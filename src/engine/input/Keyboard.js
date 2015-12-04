let debug = require('debug')('game:engine/input/utils/Keyboard');

let keys = {
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
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 86,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
};

let codes = {};

let Keyboard = {
    _pressed: {},

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        this._pressed[event.keyCode] = false;
    },

    keyByCode: function (code) {
        return codes[code];
    },

    keys: keys
};

for (let key of Object.keys(keys)) {
    let code = keys[key];

    codes[code] = key;
    Keyboard[key] = code;
}

window.addEventListener('keyup', function (event) {
    Keyboard.onKeyup(event);
    event.preventDefault();
}, false);

window.addEventListener('keydown', function (event) {
    Keyboard.onKeydown(event);
    event.preventDefault();
}, false);

export default Keyboard;
