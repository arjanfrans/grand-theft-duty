let debug = require('debug')('game:engine/logic/play/entities/Character');

import Entity from '../../../../engine/entities/Entity';
import WeaponFactory from '../weapons/WeaponFactory';

const GRAVITY = -0.4;

class Character extends Entity {
    constructor (x, y, z, width, height, depth) {
        super(x, y, z, width, height, depth);

        this.weapons = [];
        this.currentWeaponIndex = 0;
        this.currentWeapon = null;

        // TODO remove this hardcoded stuff
        this.addWeapon(WeaponFactory.mp44());
        this.addWeapon(WeaponFactory.thompson());
        this.currentWeapon = this.weapons[0];

        this.maxHealth = 100;
        this.walkingSpeed = 0.1;
        this.runningSpeed = 0.2;

        this.reset();

        this.options.physics = true;
        this.options.bullets = true;
        this.options.isCharacter = true;
    }

    set isRunning (running) {
        if (running) {
            this._isRunning = true;
            this.speed = this.runningSpeed;
        } else {
            this._isRunning = false;
            this.speed = this.walkingSpeed;
        }
    }

    get isRunning () {
        return this._isRunning;
    }

    addWeapon (weapon) {
        // TODO increase ammo if weapon is the same
        this.weapons.push(weapon);
    }

    scrollWeapons (direction) {
        if (direction === 'up') {
            if (this.currentWeaponIndex === this.weapons.length - 1) {
                this.currentWeaponIndex = 0;
            } else {
                this.currentWeaponIndex += 1;
            }
        } else if (direction === 'down') {
            if (this.currentWeaponIndex === 0) {
                this.currentWeaponIndex = this.weapons.length - 1;
            } else {
                this.currentWeaponIndex -= 1;
            }
        } else {
            throw new Error('direction is not "up" or "down"');
        }

        this.currentWeapon = this.weapons[this.currentWeaponIndex];
    }

    reload () {
        if (!this.dead && this.currentWeapon) {
            this.currentWeapon.reload();
        }
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    hitByBullet (bullet) {
        this.health -= bullet.damage;

        if (this.health === 0) {
            this.kill();
        }
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    fireBullet () {
        if (!this.dead && this.currentWeapon) {
            let fired = this.currentWeapon.fire();

            if (fired) {
                this.actions.firedBullet = true;
            }
        }
    }

    reset () {
        super.reset();

        this._isRunning = false;
        this.speed = this.walkingSpeed;
        this.health = 100;

        this.health = this.maxHealth;
        this.actions.firedBullet = false;
    }

    update (delta) {
        super.update(delta);

        if (this.actions.firedBullet) {
            this.actions.firedBullet = false;
        }

        if (this.currentWeapon) {
            this.currentWeapon.update(delta);
        }
    }
}

export default Character;
