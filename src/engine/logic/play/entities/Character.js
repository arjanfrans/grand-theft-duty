let debug = require('debug')('game:engine/logic/play/entities/Character');

import Entity from './Entity';

const GRAVITY = -400;

class Character extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.canFireBullet = true;
        this.fireRate = 100;
        this.firedTime = 0;
        this.lives = 5;

        this.options.physics = true;
        this.options.bullets = true;
        this.options.isCharacter = true;
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    hitByBullet () {
        this.lives -= 1;

        if (this.lives === 0) {
            this.kill();
        }
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

    reset () {
        this.lives = 5;
        this.canFireBullet = true;
        this.firedTime = 0;
        this.actions.firedBullet = false;
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
