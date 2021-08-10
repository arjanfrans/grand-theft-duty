import { Entity } from "./Entity";
import { Soldier } from "./Soldier";

export class Bullet extends Entity {
    public firedBy?: Soldier;
    public firedByWeapon?: any;
    private maxDistance: number = 500;
    private traveledDistance: number = 0;

    constructor(x, y, z, width, height) {
        super(x, y, z, width, height);

        this.dead = true;
        this.speed = 0.3;

        this.options.isBullet = true;
    }

    get damage() {
        if (this.firedByWeapon) {
            return this.firedByWeapon.damage;
        }

        return 0;
    }

    update(delta) {
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
