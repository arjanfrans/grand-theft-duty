import {Polygon} from '../../engine/collision/Polygon';
import {Vector2} from "three";

const DEFAULT_SPEED = 0.2;
const DEFAULT_ROTATION_SPEED = 0.3;

export class Entity {
    public position: { x: number; y: number; z: number };
    public previousPosition: { x: number; y: number; z: number };
    public width: number;
    public height: number;
    public depth: number;
    public speed: number;
    public rotationSpeed: number;
    private readonly _body: Polygon;
    public options: {
        isPlayer: boolean; physics: boolean; isBullet: boolean; isCharacter: boolean; audio: boolean; bullets: boolean, isSoldier: boolean
    };
    public angle: number = Math.PI * 2;
    public dead: boolean = false;
    public velocity: { x: number; y: number; z: number } = {
        x: 0,
        y: 0,
        z: 0
    };
    public isMoving: boolean = false;
    public reverse: boolean = false;
    public angularVelocity: number = 0;
    public collidable: boolean = true;
    public shouldUpdate: boolean = true;
    public actions: {
        firedBullet: boolean;
    } = {
        firedBullet: false
    };

    constructor(x: number, y: number, z = 0, width = 0, height = 0, depth = 0) {
        this.position = {
            x: x,
            y: y,
            z: z
        };

        this.previousPosition = {
            x: x,
            y: y,
            z: z
        };

        this.width = width;
        this.height = height;
        this.depth = depth;

        this.speed = DEFAULT_SPEED;
        this.rotationSpeed = DEFAULT_ROTATION_SPEED;

        this.reset();

        this._body = new Polygon(new Vector2(this.x, this.y), [
            new Vector2(-this.halfWidth, -this.halfHeight),
            new Vector2(-this.halfWidth, this.halfHeight),
            new Vector2(this.halfWidth, this.halfHeight),
            new Vector2(this.halfWidth, 0)
        ]);

        this.options = {
            physics: false,
            bullets: false,
            audio: false,
            isBullet: false,
            isPlayer: false,
            isCharacter: false,
            isSoldier: false
        };
    }

    get rotatedBody() {
        const body = this._body;

        body.setAngle(this.angle);

        return body;
    }

    onWallCollision() {
        return null;
    }

    get body() {
        this._body.position.x = this.position.x;
        this._body.position.y = this.position.y;

        return this._body;
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get z() {
        return this.position.z;
    }

    get halfWidth() {
        return this.width / 2;
    }

    get halfHeight() {
        return this.height / 2;
    }

    kill() {
        this.dead = true;
    }

    get point(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    reset() {
        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };

        this.dead = false;
        this.reverse = false;
        this.angle = Math.PI * 2;
        this.angularVelocity = 0;

        // If entity is moving backwards
        this.reverse = false;

        this.collidable = true;
        this.shouldUpdate = true;

        this.isMoving = false;

        // Actions can trigger things that should happen in the next update.
        this.actions = {
            firedBullet: false
        };
    }

    respawn(position) {
        this.reset();

        this.position = {
            x: position.x,
            y: position.y,
            z: position.z
        };

        this.previousPosition = {
            x: position.x,
            y: position.y,
            z: position.z
        };
    }

    moveUp() {
        this.reverse = false;
        this.isMoving = true;
        this.velocity.x = -this.speed * Math.cos(this.angle);
        this.velocity.y = -this.speed * Math.sin(this.angle);
    }

    moveDown() {
        this.reverse = true;
        this.isMoving = true;
        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);
    }

    turnLeft() {
        this.angularVelocity = this.rotationSpeed * (Math.PI / 180);
    }

    turnRight() {
        this.angularVelocity = -this.rotationSpeed * (Math.PI / 180);
    }

    stopMoving() {
        this.isMoving = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    stopTurning() {
        this.angularVelocity = 0;
    }

    update(delta) {
        if (!this.dead) {
            this.angle += this.angularVelocity * delta;

            if (this.angle < 0) {
                this.angle = (Math.PI * 2) - this.angle;
            }

            this.previousPosition.x = this.position.x;
            this.previousPosition.y = this.position.y;
            this.previousPosition.z = this.position.z;

            this.position.x += this.velocity.x * delta;
            this.position.y += this.velocity.y * delta;
            this.position.z += this.velocity.z * delta;
        }
    }
}
