let debug = require('debug')('game:input/player');

let Keyboard = require('../utils/keyboard');

class PlayerInput {
    constructor (player) {
        this.player = player;
    }

    update () {
        if (Keyboard.isDown(Keyboard.UP)) {
            debug('PlayerInput up');
            this.player.moveUp();
        } else {
            this.player.stopMoving();
        }
    }
}

module.exports = PlayerInput;
