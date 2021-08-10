import {Character} from './Character';
import WeaponFactory from '../weapons/WeaponFactory';

export class Soldier extends Character {
    public name: string;
    public weapons: any[] = [];
    public currentWeaponIndex: number = 0;
    public currentWeapon?: any;
    public team: any;
    public maxHealth: number = 100;
    public walkingSpeed: number = 0.1;
    public runningSpeed: number = 0.2;

    // Contains the character killed, and the count
    public kills: Map<Character, number> = new Map();

    // Contains the characters killed by, and the count
    public deaths: Map<Character, number> = new Map();

    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth);

        // FIXME make configurable
        this.name = 'cpu';
        this.team = team;

        // TODO remove this hardcoded stuff
        this.addWeapon(WeaponFactory.mp44());
        this.addWeapon(WeaponFactory.thompson());
        this.currentWeapon = this.weapons[0];

        this.reset();

        this.options.isSoldier = true;
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

    hitByBullet (bullet) {
        super.hitByBullet(bullet);

        // TODO prevent team killing / make configurable
        if (this.health === 0) {
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
        }
    }

    kill () {
        super.kill();
        const suicides = this.deaths.get(this);

        if (suicides) {
            this.deaths.set(this, suicides + 1);
        } else {
            this.deaths.set(this, 1);
        }
    }

    get totalKills () {
        let total = 0;

        for (const kill of this.kills.values()) {
            total += kill;
        }

        return total;
    }

    get totalDeaths () {
        let total = 0;

        for (const death of this.deaths.values()) {
            total += death;
        }

        return total;
    }

    fireBullet () {
        if (!this.dead && this.currentWeapon) {
            const fired = this.currentWeapon.fire();

            if (fired) {
                this.actions.firedBullet = true;
            }
        }
    }

    reset () {
        super.reset();

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
