let debug = require('debug')('game:engine/entities/character');

import Entity from './entity';

const GRAVITY = -400;

class Character extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    fireBullet () {

    }
}

export default Character;
