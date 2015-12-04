import Keyboard from './Keyboard';

class Input {
    constructor () {
        this._previousKeys = {};
    }

    downOnce (keyCode) {
        if (!this._previousKeys[keyCode] && Keyboard.isDown(keyCode)) {
            this._previousKeys[keyCode] = true;

            return true;
        } else if (this._previousKeys[keyCode] && !Keyboard.isDown(keyCode)) {
            this._previousKeys[keyCode] = false;
        }

        return false;
    }
}

export default Input;
