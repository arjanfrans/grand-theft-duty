import GamepadMicro from './utils/gamepad-micro';

const _gp = new GamepadMicro();
let _gamepads = [];

const Gamepad = {
    isDown: function (index, button) {
        if (_gamepads.length > 0) {
            // FIXME rewrite gamepad-micro
            const gamepad = _gamepads[index + 1];

            if (gamepad.buttons[button] && gamepad.buttons[button].held) {
                return true;
            }

            return false;
        }
    },
    isStickDown: function (index, stick, direction) {
        if (_gamepads.length > 0) {
            // FIXME rewrite gamepad-micro
            const gamepad = _gamepads[index + 1];

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
};

_gp.onUpdate(function (gamepads) {
    _gamepads = gamepads;

    if (_gp.gamepadsConnected) {

    } else {

    }
});

export default Gamepad;
