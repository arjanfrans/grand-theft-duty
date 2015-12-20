let specialKeys = {
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222
};

let specialKeysShift = {
    ':': 186,
    '+': 187,
    '<': 188,
    '_': 189,
    '>': 190,
    '?': 191,
    '~': 192,
    '{': 219,
    '|': 220,
    '}': 221,
    '"': 222
};

let numberKeys = {
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57
};

let letterKeys = {
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

let keys = {
    BACKSPACE: 8,
    CTRL: 17,
    SPACE: 32,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    TAB: 9,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

for (let key of Object.keys(specialKeys)) {
    keys[key] = specialKeys[key];
}

for (let key of Object.keys(numberKeys)) {
    keys[key] = numberKeys[key];
}

for (let key of Object.keys(letterKeys)) {
    keys[key] = letterKeys[key];
}

let shiftKeys = {};

for (let shiftKey of Object.keys(specialKeysShift)) {
    shiftKeys[shiftKey] = specialKeysShift[shiftKey];
}

let codes = {};
let codesShift = {};

let Keyboard = {
    _pressed: {},
    shiftDown: false,
    lastPressed: null,
    lastPressedIsChar () {
        let charKeys = Object.keys(specialKeys).concat(Object.keys(numberKeys)).concat(Object.keys(letterKeys));
        let charCodes = [];

        for (let charKey of charKeys) {
            charCodes.push(keys[charKey]);
        }

        if (this.lastPressed && charCodes.indexOf(this.lastPressed) !== -1) {
            return true;
        }

        return false;
    },

    lastPressedChar () {
        if (this.shiftDown) {
            if (Object.keys(shiftKeys).indexOf(codesShift[this.lastPressed]) !== -1) {
                return codesShift[this.lastPressed];
            }

            return codes[this.lastPressed].toUpperCase();
        }

        return codes[this.lastPressed].toLowerCase();
    },

    isDown (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown (event) {
        this.shiftDown = event.shiftKey;
        this.lastPressed = event.keyCode;
        this._pressed[event.keyCode] = true;
    },

    onKeyup (event) {
        this._pressed[event.keyCode] = false;
    },

    keyByCode (code) {
        return codes[code];
    },

    get pressedCodes () {
        return this._pressed;
    },

    get pressedKeys () {
        let pressed = [];

        for (let code of this._pressed) {
            pressed.push(this.keyByCode(code));
        }

        return pressed;
    },

    keys: keys,
    get letterKeyCodes () {
        let letterCodes = [];

        for (let key of Object.keys(letterKeys)) {
            letterCodes.push(letterKeys[key]);
        }

        return letterCodes;
    }
};

for (let key of Object.keys(keys)) {
    let code = keys[key];

    codes[code] = key;
    Keyboard[key] = code;
}

for (let shiftKey of Object.keys(shiftKeys)) {
    let code = shiftKeys[shiftKey];

    codesShift[code] = shiftKey;
    Keyboard[shiftKey] = code;
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
