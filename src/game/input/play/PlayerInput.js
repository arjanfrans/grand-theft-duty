let debug = require('debug')('game:engine/input/play/PlayerInput');

import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';

class PlayerInput {
    constructor (player, stats) {
        this.player = player;

        this.previousKeys = {};
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.TAB)) {

        }

        if (Keyboard.isDown(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
            this.player.move('up');
        } else if (Keyboard.isDown(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
            this.player.move('down');
        } else {
            this.player.stopMoving();
        }

        if (Keyboard.isDown(Keyboard.RIGHT) || Gamepad.isStickDown(0, 'right', 'right')) {
            this.player.turn('right');
        } else if (Keyboard.isDown(Keyboard.LEFT) || Gamepad.isStickDown(0, 'right', 'left')) {
            this.player.turn('left');
        } else {
            this.player.stopTurning();
        }

        if (!this.player.isRunning && Keyboard.isDown(Keyboard.CTRL)) {
            this.player.fireBullet();
        }

        if (Keyboard.isDown(Keyboard.SHIFT)) {
            this.player.isRunning = true;
        } else {
            this.player.isRunning = false;
        }

        // TODO built better mechanism to detect if pressed down once
        if (!this.previousKeys.R && Keyboard.isDown(Keyboard.R)) {
            this.previousKeys.R = true;
            this.player.reload();
        } else if (this.previousKeys.R && !Keyboard.isDown(Keyboard.R)) {
            this.previousKeys.R = false;
        }

        if (!this.previousKeys.X && Keyboard.isDown(Keyboard.X)) {
            this.previousKeys.X = true;
            this.player.scrollWeapons('down');
        } else if (this.previousKeys.X && !Keyboard.isDown(Keyboard.X)) {
            this.previousKeys.X = false;
        }

        if (!this.previousKeys.Z && Keyboard.isDown(Keyboard.Z)) {
            this.previousKeys.Z = true;
            this.player.scrollWeapons('up');
        } else if (this.previousKeys.Z && !Keyboard.isDown(Keyboard.Z)) {
            this.previousKeys.Z = false;
        }
    }
}

export default PlayerInput;
