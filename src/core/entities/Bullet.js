import {Entity} from './Entity';

class Bullet extends Entity {
    constructor (x, y, z, width, height) {
        super(x, y, z, width, height);

        this.dead = true;
        this.firedBy = null;
        this.firedByWeapon = null;
        this.speed = 0.3;

        this.maxDistance = 500;
        this.traveledDistance = 0;

        this.options.isBullet = true;
    }

    get damage () {
        if (this.firedByWeapon) {
            return this.firedByWeapon.damage;
        }

        return 0;
    }

    update (delta) {
        super.update(delta);

        this.traveledDistance += this.speed * delta;

        if (this.traveledDistance > this.maxDistance) {
            this.dead = true;
            this.traveledDistance = 0;
        } else {
            this.moveUp();
        }
    }
}

export default Bullet;
