import { Entity } from "./Entity";

const GRAVITY = -0.2;

/**
 * Entities that walk, run, jump, die and get hit by bullets.
 */
export class Character extends Entity {
    public maxHealth: number = 100;
    public walkingSpeed: number = 0.1;
    public runningSpeed: number = 0.2;
    private _isRunning: boolean = false;
    public health: number = 100;

    constructor(x, y, z, width, height, depth) {
        super(x, y, z, width, height, depth);

        this.reset();

        this.options.physics = true;
        this.options.bullets = true;
        this.options.isCharacter = true;
    }

    set isRunning(running) {
        if (running) {
            this._isRunning = true;
            this.speed = this.runningSpeed;
        } else {
            this._isRunning = false;
            this.speed = this.walkingSpeed;
        }
    }

    get isRunning() {
        return this._isRunning;
    }

    fall() {
        this.velocity.z = GRAVITY;
    }

    hitByBullet(bullet) {
        this.health -= bullet.damage;

        if (this.health === 0) {
            this.kill();
        }
    }

    stopFalling() {
        this.velocity.z = 0;
    }

    reset() {
        super.reset();

        this._isRunning = false;
        this.speed = this.walkingSpeed;
        this.health = 100;

        this.health = this.maxHealth;
    }

    update(delta) {
        super.update(delta);

        if (this.position.z <= 0) {
            this.kill();
        }
    }
}
