let debug = require('debug')('game:engine/logic/play/entities/Player');

import Character from './Character';

class Player extends Character {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.options.isPlayer = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default Player;
