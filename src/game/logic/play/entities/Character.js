let debug = require('debug')('game:engine/logic/play/entities/Character');

import Entity from '../../../../engine/entities/Entity';

const GRAVITY = -0.4;

class Character extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.canFireBullet = true;
        this.fireRate = 150;
        this.firedTime = 0;
        this.maxHealth = 5;
        this.health = 5;
        this.ammo = 31;

        this.options.physics = true;
        this.options.bullets = true;
        this.options.isCharacter = true;
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    hitByBullet () {
        this.health -= 1;

        if (this.health === 0) {
            this.kill();
        }
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    fireBullet () {
        if (this.canFireBullet && !this.dead) {
            if (this.ammo > 0) {
                this.actions.firedBullet = true;
                this.ammo -= 1;
            }

            this.canFireBullet = false;
        }
    }

    reset () {
        this.health = this.maxHealth;
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
            this.firedTime += delta;
            if (this.firedTime > this.fireRate) {
                this.firedTime = 0;
                this.canFireBullet = true;
            }
        }
    }
}

export default Character;
