let debug = require('debug')('game:engine/entities/character');

import Entity from './entity';
import Bullet from './bullet';

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
        debug('fireing bullet');

        let bullet = new Bullet(this.position.x, this.position.y, this.position.z, 5, 5);

        bullet.angle = this.angle;

        return bullet;
    }
}

export default Character;
