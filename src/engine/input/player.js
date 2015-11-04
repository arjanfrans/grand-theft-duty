'use strict';

let debug = require('debug')('game:engine/input/player');

let Keyboard = require('./keyboard');

class PlayerInput {
    constructor (player) {
        this.player = player;
    }

    update () {
        if (Keyboard.isDown(Keyboard.UP)) {
            this.player.move('up');
        } else if (Keyboard.isDown(Keyboard.DOWN)) {
            this.player.move('down');
        } else {
            this.player.stopMoving();
        }

        if (Keyboard.isDown(Keyboard.RIGHT)) {
            this.player.turn('right');
        } else if (Keyboard.isDown(Keyboard.LEFT)) {
            this.player.turn('left');
        } else {
            this.player.stopTurning();
        }
    }
}

module.exports = PlayerInput;
