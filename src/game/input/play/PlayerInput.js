let debug = require('debug')('game:engine/input/play/PlayerInput');

import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';

class PlayerInput {
    constructor (player) {
        this.player = player;
    }

    update () {
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

        if (Keyboard.isDown(Keyboard.CTRL)) {
            this.player.fireBullet();
        }
    }
}

export default PlayerInput;
