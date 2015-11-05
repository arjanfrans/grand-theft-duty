/**
 * Copyright 2014 Christopher Dolphin. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author dolphin@likethemammal.com (Chris Dolphin)
 */

function GamepadMicro () {
    this._buttonNames = [
        'actionSouth',
        'actionEast',
        'actionWest',
        'actionNorth',
        'leftBumper',
        'rightBumper',
        'leftTrigger',
        'rightTrigger',
        'select',
        'start',
        'leftStick',
        'rightStick',
        'dPadUp',
        'dPadDown',
        'dPadLeft',
        'dPadRight',
        'extra'
    ];

    this.reset();
}

GamepadMicro.prototype.reset = function () {
    this._ticking = false;
    this._prevTimestamps = [];
    this._connectionListening = false;
    this._updateCallback = function () {};
    this._prevRawGamepadTypes = [];
    this.gamepadconnected = _getRawGamepads.length > 0;
    this.gamepadConnected = !!this.gamepadconnected;
    this.gamepadSupported = !!_gamepadSupported();
    this.gamepads = [];
    this._heldButtonDelay = 200;
    this._heldTimestampByGamepad = {};
};

function _newGamepad () {
    return {
        leftStick: { x: 0, y: 0 },
        rightStick: { x: 0, y: 0 },
        dPad: { x: 0, y: 0 },
        buttons: {},
        _pressed: {},
        timestamp: 0
    };
}

GamepadMicro.prototype.onUpdate = function (callback) {
    this._updateCallback = callback;
    this._checkForEvents();
    this._setupPoll();
};

GamepadMicro.prototype.offUpdate = function () {
    this._shouldRemoveEvents();
    this._removePoll();
};

GamepadMicro.prototype.update = function () {
    this._updateCallback(this.gamepads);
};

GamepadMicro.prototype._checkForEvents = function () {
    if (!this._connectionListening) {
        window.addEventListener('gamepadconnected', this._onGamepadConnected.bind(this), false);
        window.addEventListener('gamepaddisconnected', this._onGamepadDisconnected.bind(this), false);
        this._connectionListening = true;
    }
};

GamepadMicro.prototype._shouldRemoveEvents = function () {
    if (this._connectionListening) {
        window.removeEventListener('gamepadconnected', this._onGamepadConnected.bind(this));
        window.removeEventListener('gamepaddisconnected', this._onGamepadDisconnected.bind(this));
        this._connectionListening = false;
    }
};

GamepadMicro.prototype._onGamepadConnected = function (event) {
    let gamepad = event.gamepad;

    if (gamepad.mapping === 'standard') {
        this.gamepads[gamepad.index] = _newGamepad();
        this.gamepadconnected = true;

        this.update();
    }
};

GamepadMicro.prototype._onGamepadDisconnected = function (event) {
    let disconnectedGamepad = event.gamepad;
    let gamepads = this.gamepads;

    gamepads.forEach(function (gamepad, index) {
        if (index === disconnectedGamepad.index) {
            gamepads.splice(index, 1);
        }
    });

    if (!gamepads.length) {
        this.gamepadconnected = false;
    }

    this.update();
};

function _getRawGamepads () {
    let gamepads = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());
    let standardGamepads = [];

    if (gamepads) {
        for (let i = 0, len = gamepads.length; i < len; i++) {
            let gp = gamepads[i];

            if (gp && gp.mapping === 'standard') {
                standardGamepads.push(gp);
            }
        }
    }

    return standardGamepads;
}

function _buttonPressed (gamepad, index) {
    if (!gamepad || !gamepad.buttons || index >= gamepad.buttons.length) {
        return false;
    }

    let b = gamepad.buttons[index];
    let pressure;

    if (!b) {
        return false;
    }

    pressure = b;

    if (typeof b === 'object') {
        pressure = b.value;
    }

    return (pressure === 1.0);
}

GamepadMicro.prototype._checkForGamepadChange = function () {
    let rawGamepads = _getRawGamepads();
    let changed = false;
    let changedRawGamepads = {};
    let gamepadIndex = 0;

    for (let i = 0; i < rawGamepads.length; i++) {
        let gamepad = rawGamepads[i];
        let heldTimestamps;
        let hasBeenHeld;

        if (!gamepad.timestamp) {
            continue;
        }

        gamepadIndex = gamepad.index;

        // Browsers don't update the gamepad timestamp if a button remains held.
        // This is a manual check to see if any button has been held. Since the
        // browser would tell us if it released, we'll assume some button is
        // still held and announce it's continued heldness.
        heldTimestamps = this._heldTimestampByGamepad[gamepadIndex] || {};
        hasBeenHeld = Object.keys(heldTimestamps).length === 0;

        // Don’t do anything if the current timestamp is the same as previous
        // one, which means that the state of the gamepad hasn’t changed.
        // This is only supported by Chrome right now, so the first check
        // makes sure we’re not doing anything if the timestamps are empty
        // or undefined.

        if (gamepad.timestamp === this._prevTimestamps[gamepadIndex] && hasBeenHeld) {
            continue;
        }

        this._prevTimestamps[gamepadIndex] = gamepad.timestamp;
        changedRawGamepads[gamepadIndex] = gamepad;
        changed = true;
    }

    return (changed) ? changedRawGamepads : false;
};

GamepadMicro.prototype._poll = function () {
    let rawGamepads = this._checkForGamepadChange();

    if (!rawGamepads) {
        return;
    }

    this.gamepadconnected = true;
    this.gamepadConnected = true;
    this.gamepadSupported = true;

    let currentGamepads = this.gamepads;
    let buttonNames = this._buttonNames;

    Object.keys(rawGamepads).map((gamepadIndex) => {
        let currentRawGamepad = rawGamepads[gamepadIndex];

        if (!currentRawGamepad) {
            return;
        }

        // Gamepad(s) has changed
        if (typeof currentRawGamepad !== this._prevRawGamepadTypes[gamepadIndex]) {
            this._prevRawGamepadTypes[gamepadIndex] = typeof currentGamepad;
        }

        let activeButtons = {};
        let currentGamepad = currentGamepads[gamepadIndex] || _newGamepad();
        let heldTimestamps = this._heldTimestampByGamepad[gamepadIndex] || {};

        for (let k = 0, len = buttonNames.length; k < len; k++) {
            let name = buttonNames[k];
            let heldTimestamp = heldTimestamps[name];
            let isSameTimestamp = null;
            let wasDown = !!currentGamepad._pressed[name];
            let isDown = currentGamepad._pressed[name] = _buttonPressed(currentRawGamepad, k);
            let now = Date.now();

            if (wasDown && !isDown) {
                activeButtons[name] = {
                    released: true,
                    held: false
                };

                if (heldTimestamps) {
                    delete heldTimestamps[name];
                }
            } else if (isDown) {
                if (heldTimestamp) {
                    isSameTimestamp = heldTimestamp['gamepadTimestamp'] === currentRawGamepad.timestamp;

                    // If the gamepad timestamp hasn't changed and the time is after the held delay
                    if ((isSameTimestamp && now > heldTimestamp['browserTimestamp'] + this._heldButtonDelay) || (currentRawGamepad.timestamp > heldTimestamp['gamepadTimestamp'] + this._heldButtonDelay)) {
                        activeButtons[name] = {
                            held: true
                        };
                    }
                } else {
                    heldTimestamps[name] = {

                        // Gamepad Timestamps are HighResTimeStamps relative when gamepad was connected
                        gamepadTimestamp: currentRawGamepad.timestamp,
                        browserTimestamp: now
                    } ;
                }
            }
        }

        this._heldTimestampByGamepad[gamepadIndex] = heldTimestamps;

        currentGamepad.timestamp = currentRawGamepad.timestamp;
        currentGamepad.buttons = activeButtons;

        // update the sticks
        currentGamepad.leftStick.x = currentRawGamepad.axes[0];
        currentGamepad.leftStick.y = currentRawGamepad.axes[1];
        currentGamepad.rightStick.x = currentRawGamepad.axes[2];
        currentGamepad.rightStick.y = currentRawGamepad.axes[3];

        // dpad isn't a true stick, infer from buttons
        currentGamepad.dPad.x = (currentGamepad.buttons.dPadLeft ? -1 : 0) + (currentGamepad.buttons.dPadRight ? 1 : 0);
        currentGamepad.dPad.y = (currentGamepad.buttons.dPadUp ? -1 : 0) + (currentGamepad.buttons.dPadDown ? 1 : 0);

        this.gamepads[gamepadIndex] = currentGamepad;
    });

    this.update();
};

GamepadMicro.prototype._setupPoll = function () {
    if (!this._ticking) {
        this._ticking = true;
        this._tick();
    }
};

GamepadMicro.prototype._tick = function () {
    let tickFunc = GamepadMicro.prototype._tick.bind(this);

    this._poll();

    if (this._ticking) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(tickFunc);
        } else if (window.mozRequestAnimationFrame) {
            window.mozRequestAnimationFrame(tickFunc);
        } else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(tickFunc);
        }

        // Note lack of setTimeout since all the browsers that support
        // Gamepad API are already supporting requestAnimationFrame().
    }
};

GamepadMicro.prototype._removePoll = function () {
    this._ticking = false;
};

function _gamepadSupported () {
    return navigator.getGamepads ||
        !!navigator.webkitGetGamepads ||
        !!navigator.webkitGamepads;
}

module.exports = GamepadMicro;
