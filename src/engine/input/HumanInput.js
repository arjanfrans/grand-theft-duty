import Keyboard from './Keyboard';
import Gamepad from './Gamepad';

class HumanInput {
    constructor () {
        this._previousKeyboardKeys = {};
        this._previousGamepadStick = {};
        this._previousGamepadButton = {};
        this.gamepadIndex = 0;
    }

    keyboardDownOnce (keyCode) {
        if (!this._previousKeyboardKeys[keyCode] && Keyboard.isDown(keyCode)) {
            this._previousKeyboardKeys[keyCode] = true;

            return true;
        } else if (this._previousKeyboardKeys[keyCode] && !Keyboard.isDown(keyCode)) {
            this._previousKeyboardKeys[keyCode] = false;
        }

        return false;
    }

    gamepadStickDownOnce (stick, direction) {
        if (!this._previousGamepadStick[stick + direction] &&
                !Gamepad.isStickDown(this.gamepadIndex, stick, direction)) {
            this._previousGamepadStick[stick + direction] = true;
        } else if (this._previousGamepadStick[stick + direction] &&
                !Gamepad.isStickDown(this.gamepadIndex, stick, direction)) {
            this._previousGamepadStick[stick + direction] = false;
        }
    }

    gamepadButtonDownOnce (button) {
        if (!this._previousGamepadButton[button] && !Gamepad.isDown(this.gamepadIndex, button)) {
            this._previousGamepadButton[button] = true;
        } else if (this._previousGamepadButton[button] && !Gamepad.isDown(this.gamepadIndex, button)) {
            this._previousGamepadButton[button] = false;
        }
    }
}

export default HumanInput;
