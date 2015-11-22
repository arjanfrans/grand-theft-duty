let debug = require('debug')('game:engine/logic/play/entities/Entity');

import Polygon from '../collision/Polygon';
import Vector from '../collision/Vector';

const DEFAULT_SPEED = 0.2;
const DEFAULT_ROTATION_SPEED = 0.3;

class Entity {
    constructor (x, y, z = 0, width = 0, height = 0, depth = 0) {
        this.position = {
            x: x,
            y: y,
            z: z
        };

        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };

        this.previousPosition = {
            x: x,
            y: y,
            z: z
        };

        this.angularVelocity = 0;

        this.angle = 0 * (Math.PI / 180);

        this.width = width;
        this.height = height;
        this.depth = depth;

        // If entity is moving backwards
        this.reverse = false;

        this.speed = DEFAULT_SPEED;
        this.rotationSpeed = DEFAULT_ROTATION_SPEED;

        this.collidable = true;
        this.shouldUpdate = true;

        this.isMoving = false;

        this._body = new Polygon(new Vector(this.x, this.y), [
            new Vector(-this.halfWidth, -this.halfHeight),
            new Vector(-this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, 0)
        ]);

        this.dead = false;

        // Actions can trigger things that should happen in the next update.
        this.actions = {};

        this.options = {
            physics: false,
            bullets: false,
            audio: false,
            isPlayer: false,
            isCharacter: false
        };
    }

    get rotatedBody () {
        let body = this._body;

        body.setAngle(this.angle);

        return body;
    }

    get body () {
        this._body.position.x = this.position.x;
        this._body.position.y = this.position.y;

        return this._body;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }

    get z () {
        return this.position.z;
    }

    get halfWidth () {
        return this.width / 2;
    }

    get halfHeight () {
        return this.height / 2;
    }

    kill () {
        this.dead = true;
    }

    revive () {
        this.dead = false;
    }

    /**
     * Move the entity in direction "up" or "down".
     *
     * @param {string} direction "up" or "down"
     *
     * @returns {void}
     */
    move (direction) {
        if (!direction && typeof direction !== 'string' && ['up', 'down'].includes(direction)) {
            throw new Error('"direction" must equal "up" or "down"');
        }

        let speed = this.speed;

        if (direction === 'up') {
            this.reverse = false;
            speed = -this.speed;
        } else {
            this.reverse = true;
            speed = this.speed;
        }

        this.isMoving = true;
        this.velocity.x = speed * Math.cos(this.angle);
        this.velocity.y = speed * Math.sin(this.angle);
    };

    /**
     * Turn an entity to the "left" or "right".
     *
     * @param {string} direction "left" or "right"
     *
     * @returns {void}
     */
    turn (direction) {
        if (!direction && typeof direction !== 'string' && ['left', 'right'].includes(direction)) {
            throw new Error('"direction" must equal "left" or "right"');
        }

        let rotationSpeed = this.rotationSpeed;

        if (direction === 'right') {
            rotationSpeed = -this.rotationSpeed;
        }

        this.angularVelocity = rotationSpeed * (Math.PI / 180);
    }

    stopMoving () {
        this.isMoving = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    stopTurning () {
        this.angularVelocity = 0;
    }

    update (delta) {
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
};

export default Entity;
