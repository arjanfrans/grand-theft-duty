let debug = require('debug')('game:engine/entities/player');

import Character from './character';

class Player extends Character {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.options.isPlayer = true;
    }

    update (delta) {
        super.update(delta);
    }
}

module.exports = Player;
