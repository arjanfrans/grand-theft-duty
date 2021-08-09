import Gamepad from './Gamepad';
import {InputSourceInterface} from "./InputSourceInterface";
import {KeyboardInputSource} from "./KeyboardInputSource";
import {Keyboard} from "./Keyboard";

export class HumanInput {
    private readonly _previousKeyboardKeys: {};
    private readonly _previousGamepadStick: {};
    private readonly _previousGamepadButton: {};
    public readonly gamepadIndex: number;
    public readonly keyboard: Keyboard

    constructor (inputSources: Map<string, InputSourceInterface>) {
        this._previousKeyboardKeys = {};
        this._previousGamepadStick = {};
        this._previousGamepadButton = {};
        this.gamepadIndex = 0;

        const keyboardInputSource = inputSources.get('keyboard');

        if (!(keyboardInputSource instanceof KeyboardInputSource)) {
            throw new Error('Keyboard input source not found.');
        }

        this.keyboard = keyboardInputSource.keyboard;
    }

    keyboardDownOnce (keyCode) {
        if (!this._previousKeyboardKeys[keyCode] && this.keyboard.isDown(keyCode)) {
            this._previousKeyboardKeys[keyCode] = true;

            return true;
        } else if (this._previousKeyboardKeys[keyCode] && !this.keyboard.isDown(keyCode)) {
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
