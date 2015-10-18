let debug = require('debug')('game:input/player');

let Keyboard = require('../utils/keyboard');

class PlayerInput {
    constructor (player) {
        this.player = player;
    }

    update () {
        if (Keyboard.isDown(Keyboard.UP)) {
            this.player.moveUp();
        } else if (Keyboard.isDown(Keyboard.DOWN)) {
            this.player.moveDown();
        } else {
            this.player.stopMoving();
        }

        if (Keyboard.isDown(Keyboard.RIGHT)) {
            this.player.turnRight();
        } else if (Keyboard.isDown(Keyboard.LEFT)) {
            this.player.turnLeft();
        } else {
            this.player.stopTurning();
        }
    }
}

module.exports = PlayerInput;
