let debug = require('debug')('game:engine/input/player');

let Keyboard = require('./keyboard');
let Gamepad = require('./gamepad');

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
    }
}

module.exports = PlayerInput;
