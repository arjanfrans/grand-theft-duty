let debug = require('debug')('game:engine/logic/play/entities/Player');

import Character from './Character';

class Player extends Character {
    constructor (x, y, z, width, height, depth) {
        super(x, y, z, width, height, depth);

        this.options.isPlayer = true;
        this.options.audio = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default Player;
