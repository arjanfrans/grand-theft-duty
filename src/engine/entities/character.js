let debug = require('debug')('game:engine/entities/character');

import Entity from './entity';
import Bullet from './bullet';

const GRAVITY = -400;

class Character extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.canFireBullet = true;
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    fireBullet () {
        if (this.canFireBullet) {
            this.canFireBullet = false;
            setTimeout(() => {
                this.actions.firedBullet = true;
                this.canFireBullet = true;
            }, 200);
        }
    }
}

export default Character;
