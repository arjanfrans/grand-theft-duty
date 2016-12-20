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

/**
 * GamepadMicro provides an easy interface to the Gamepad API.
 *
 * @constructor
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
    this.gamepadConnected = Boolean(this.gamepadconnected);
    this.gamepadSupported = Boolean(_gamepadSupported());
    this.gamepads = [];
    this._heldButtonDelay = 200;
    this._heldTimestampByGamepad = {};
};

const _newGamepad = function () {
    return {
        leftStick: { x: 0, y: 0 },
        rightStick: { x: 0, y: 0 },
        dPad: { x: 0, y: 0 },
        buttons: {},
        _pressed: {},
        timestamp: 0
    };
};

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
    const gamepad = event.gamepad;

    if (gamepad.mapping === 'standard') {
        this.gamepads[gamepad.index] = _newGamepad();
        this.gamepadconnected = true;

        this.update();
    }
};

GamepadMicro.prototype._onGamepadDisconnected = function (event) {
    const disconnectedGamepad = event.gamepad;
    const gamepads = this.gamepads;

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

const _getRawGamepads = function () {
    const gamepads = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());
    const standardGamepads = [];

    if (gamepads) {
        for (let i = 0, len = gamepads.length; i < len; i++) {
            const gp = gamepads[i];

            if (gp && gp.mapping === 'standard') {
                standardGamepads.push(gp);
            }
        }
    }

    return standardGamepads;
};

const _buttonPressed = function (gamepad, index) {
    if (!gamepad || !gamepad.buttons || index >= gamepad.buttons.length) {
        return false;
    }

    const b = gamepad.buttons[index];
    let pressure = null;

    if (!b) {
        return false;
    }

    pressure = b;

    if (typeof b === 'object') {
        pressure = b.value;
    }

    return (pressure === 1.0);
};

GamepadMicro.prototype._checkForGamepadChange = function () {
    const rawGamepads = _getRawGamepads();
    let changed = false;
    const changedRawGamepads = {};
    let gamepadIndex = 0;

    for (let i = 0; i < rawGamepads.length; i++) {
        const gamepad = rawGamepads[i];
        let heldTimestamps = null;
        let hasBeenHeld = null;

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
    const rawGamepads = this._checkForGamepadChange();

    if (!rawGamepads) {
        return;
    }

    this.gamepadconnected = true;
    this.gamepadConnected = true;
    this.gamepadSupported = true;

    const currentGamepads = this.gamepads;
    const buttonNames = this._buttonNames;

    Object.keys(rawGamepads).map((gamepadIndex) => {
        const currentRawGamepad = rawGamepads[gamepadIndex];

        if (!currentRawGamepad) {
            return;
        }

        // Gamepad(s) has changed
        if (typeof currentRawGamepad !== this._prevRawGamepadTypes[gamepadIndex]) {
            this._prevRawGamepadTypes[gamepadIndex] = typeof currentGamepad;
        }

        const activeButtons = {};
        const currentGamepad = currentGamepads[gamepadIndex] || _newGamepad();
        const heldTimestamps = this._heldTimestampByGamepad[gamepadIndex] || {};

        for (let k = 0, len = buttonNames.length; k < len; k++) {
            const name = buttonNames[k];
            const heldTimestamp = heldTimestamps[name];
            let isSameTimestamp = null;
            const wasDown = Boolean(currentGamepad._pressed[name]);
            const isDown = currentGamepad._pressed[name] = _buttonPressed(currentRawGamepad, k);
            const now = Date.now();

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
                    isSameTimestamp = heldTimestamp.gamepadTimestamp === currentRawGamepad.timestamp;

                    // If the gamepad timestamp hasn't changed and the time is after the held delay
                    if ((isSameTimestamp && now > heldTimestamp.browserTimestamp + this._heldButtonDelay) || (currentRawGamepad.timestamp > heldTimestamp.gamepadTimestamp + this._heldButtonDelay)) {
                        activeButtons[name] = {
                            held: true
                        };
                    }
                } else {
                    heldTimestamps[name] = {

                        // Gamepad Timestamps are HighResTimeStamps relative when gamepad was connected
                        gamepadTimestamp: currentRawGamepad.timestamp,
                        browserTimestamp: now
                    };
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
    const tickFunc = GamepadMicro.prototype._tick.bind(this);

    this._poll();

    if (this._ticking) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(tickFunc);
        } else if (window.mozRequestAnimationFrame) {
            window.mozRequestAnimationFrame(tickFunc);
        } else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(tickFunc);
        }
    }
};

GamepadMicro.prototype._removePoll = function () {
    this._ticking = false;
};

const _gamepadSupported = function () {
    return navigator.getGamepads ||
        Boolean(navigator.webkitGetGamepads) ||
        Boolean(navigator.webkitGamepads);
};

export default GamepadMicro;
