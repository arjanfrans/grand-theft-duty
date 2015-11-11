let debug = require('debug')('game:engine/entities/character');

import Entity from './entity';

const GRAVITY = -400;

class Character extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.canFireBullet = true;
        this.fireRate = 100;
        this.firedTime = 0;

        this.options.physics = true;
        this.options.bullets = true;
        this.options.isCharacter = true;
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    fireBullet () {
        if (this.canFireBullet) {
            this.actions.firedBullet = true;
            this.canFireBullet = false;
        }
    }

    update (delta) {
        super.update(delta);

        if (this.actions.firedBullet) {
            this.actions.firedBullet = false;
        }

        if (!this.canFireBullet) {
            this.firedTime += delta * 1000;
            if (this.firedTime > this.fireRate) {
                this.firedTime = 0;
                this.canFireBullet = true;
            }
        }
    }
}

export default Character;
