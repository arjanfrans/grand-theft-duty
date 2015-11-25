let debug = require('debug')('game:engine/logic/play/entities/Character');

import Entity from '../../../../engine/entities/Entity';
import WeaponFactory from '../weapons/WeaponFactory';

const GRAVITY = -0.4;

class Character extends Entity {
    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth);

        // FIXME make configurable
        this.name = 'cpu';

        this.weapons = [];
        this.currentWeaponIndex = 0;
        this.currentWeapon = null;

        this.team = team;

        // TODO remove this hardcoded stuff
        this.addWeapon(WeaponFactory.mp44());
        this.addWeapon(WeaponFactory.thompson());
        this.currentWeapon = this.weapons[0];

        this.maxHealth = 100;
        this.walkingSpeed = 0.1;
        this.runningSpeed = 0.2;

        // Contains the character killed, and the count
        this.kills = new Map();

        // Contains the characters killed by, and the count
        this.deaths = new Map();

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

        // TODO prevent team killing / make configurable
        if (this.health === 0) {
            this.kill();

            let deathCount = this.deaths.get(bullet.firedBy);

            if (deathCount) {
                deathCount += 1;
            } else {
                deathCount = 1;
            }

            this.deaths.set(bullet.firedBy, deathCount);

            let killedByCount = bullet.firedBy.kills.get(this);

            if (killedByCount) {
                killedByCount += 1;
            } else {
                killedByCount = 1;
            }

            bullet.firedBy.kills.set(this, killedByCount);

            debug('this deaths', deathCount);
            debug('killedBy kills', killedByCount);
        }
    }

    get totalKills () {
        let total = 0;

        for (let kill of this.kills.values()) {
            total += kill;
        }

        return total;
    }

    get totalDeaths () {
        let total = 0;

        for (let death of this.deaths.values()) {
            total += death;
        }

        return total;
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

        if (this.position.z <= 0) {
            this.kill();
        }

        if (this.actions.firedBullet) {
            this.actions.firedBullet = false;
        }

        if (this.currentWeapon) {
            this.currentWeapon.update(delta);
        }
    }
}

export default Character;
