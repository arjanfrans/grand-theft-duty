'use strict';

let debug = require('debug')('game:engine/entities/player');

let Entity = require('./entity');

class Player extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);
    }

    update (delta) {
        super.update(delta);
    }
}

module.exports = Player;
