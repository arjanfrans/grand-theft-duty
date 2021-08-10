import {
    Keys,
    LetterKeys,
    NumberKeys,
    SpecialKeys,
    SpecialKeysShift,
} from "./Keys";

const keys: { [key: string]: number } = {
    ...Keys,
    ...NumberKeys,
    ...LetterKeys,
    ...SpecialKeys,
};

export class Keyboard {
    private readonly _previousKeyboardKeys: { [key: number]: boolean } = {};
    private _pressed: { [key: string]: boolean } = {};
    private shiftDown: boolean = false;
    public lastPressed?: number;
    private readonly charKeys: string[];
    private readonly codes: { [key: number]: string } = {};
    private readonly charCodes: number[] = [];
    private readonly codesShift: { [key: number]: string } = {};

    constructor() {
        this.charKeys = Object.keys(SpecialKeys)
            .concat(Object.keys(NumberKeys))
            .concat(Object.keys(LetterKeys));

        for (const [key, code] of Object.entries(keys)) {
            this.codes[code] = key;
        }

        for (const charKey of this.charKeys) {
            this.charCodes.push(keys[charKey]);
        }

        for (const shiftKey of Object.keys(SpecialKeysShift)) {
            const code = SpecialKeysShift[shiftKey];

            this.codesShift[code] = shiftKey;
        }
    }

    keyboardDownOnce(keyCode) {
        if (!this._previousKeyboardKeys[keyCode] && this.isDown(keyCode)) {
            this._previousKeyboardKeys[keyCode] = true;

            return true;
        } else if (
            this._previousKeyboardKeys[keyCode] &&
            !this.isDown(keyCode)
        ) {
            this._previousKeyboardKeys[keyCode] = false;
        }

        return false;
    }

    lastPressedIsChar() {
        const lastPressed = this.lastPressed;

        if (lastPressed && this.charCodes.indexOf(lastPressed) !== -1) {
            return true;
        }

        return false;
    }

    lastPressedChar() {
        const lastPressed = this.lastPressed;

        if (!lastPressed) {
            return undefined;
        }

        if (this.shiftDown) {
            const shiftCode = this.codesShift[lastPressed];

            if (
                shiftCode &&
                Object.keys(SpecialKeysShift).indexOf(shiftCode) !== -1
            ) {
                return this.codesShift[lastPressed];
            }

            return this.codes[lastPressed].toUpperCase();
        }

        return this.codes[lastPressed].toLowerCase();
    }

    public isDown(keyCode) {
        return this._pressed[keyCode];
    }

    public onKeydown(event) {
        this.shiftDown = event.shiftKey;
        this.lastPressed = event.keyCode;
        this._pressed[event.keyCode] = true;
    }

    onKeyup(event) {
        this._pressed[event.keyCode] = false;
    }

    keyByCode(code) {
        return this.codes[code];
    }

    get pressedCodes() {
        return this._pressed;
    }
}
