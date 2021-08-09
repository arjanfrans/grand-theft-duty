import GamepadMicro from './utils/gamepad-micro';

export class Gamepad {
    private readonly gp: any;
    private gamepad: any;
    private readonly _previousGamepadStick: {};
    private readonly _previousGamepadButton: {};
    public readonly gamepadIndex: number;

    constructor() {
        this._previousGamepadStick = {};
        this._previousGamepadButton = {};
        this.gamepadIndex = 0;
        this.gp = new GamepadMicro();

        this.gp.onUpdate((gamepads: []) => {
            this.gamepad = gamepads[this.gamepadIndex];

            if (this.gp.gamepadsconnected) {

            } else {

            }
        });

    }

    isDown (button) {
        if (this.gamepad?.buttons[button] && this.gamepad?.buttons[button].held) {
            return true;
        }

        return false;
    }

    isStickDown (stick, direction) {
        const gamepad = this.gamepad;

        if (gamepad) {
            if (stick === 'right' && gamepad.rightStick) {
                if (direction === 'right') {
                    if (gamepad.rightStick.x > 0.5) {
                        return true;
                    }
                } else if (direction === 'left') {
                    if (gamepad.rightStick.x < -0.5) {
                        return true;
                    }
                } else if (direction === 'up') {
                    if (gamepad.rightStick.y < -0.5) {
                        return true;
                    }
                } else if (direction === 'down') {
                    if (gamepad.rightStick.y > 0.5) {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            if (stick === 'left' && gamepad.leftStick) {
                if (direction === 'right') {
                    if (gamepad.leftStick.x > 0.5) {
                        return true;
                    }
                } else if (direction === 'left') {
                    if (gamepad.leftStick.x < -0.5) {
                        return true;
                    }
                } else if (direction === 'up') {
                    if (gamepad.leftStick.y < -0.5) {
                        return true;
                    }
                } else if (direction === 'down') {
                    if (gamepad.leftStick.y > 0.5) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        }
    }

    gamepadStickDownOnce (stick, direction) {
        if (!this._previousGamepadStick[stick + direction] &&
            !this.isStickDown(stick, direction)) {
            this._previousGamepadStick[stick + direction] = true;
        } else if (this._previousGamepadStick[stick + direction] &&
            !this.isStickDown(stick, direction)) {
            this._previousGamepadStick[stick + direction] = false;
        }
    }

    gamepadButtonDownOnce (button) {
        if (!this._previousGamepadButton[button] && !this.isDown(button)) {
            this._previousGamepadButton[button] = true;
        } else if (this._previousGamepadButton[button] && !this.isDown(button)) {
            this._previousGamepadButton[button] = false;
        }
    }
}


export default Gamepad;
