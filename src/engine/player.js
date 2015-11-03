let debug = require('debug')('game:engine/player');

let Polygon = require('./sat/Polygon');
let Vector = require('./sat/Vector');

const SPEED = 200;
const ROTATION_SPEED = 300;
const GRAVITY = -400;

class Player {
    constructor (x, y, z = 0, width = 32, height = 32) {
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

        this.angularVelocity = 0;

        this.angle = 0 * (Math.PI / 180);

        this.width = width;
        this.height = height;
        this.collidable = true;
        this.reverse = false;
    }

    get turnedPolygon () {
        let p = this.polygon;

        p.setAngle(this.angle);

        return p;
    }

    get polygon () {
        let position = new Vector(this.x, this.y);
        let p = new Polygon(position, [
            new Vector(-this.halfWidth, -this.halfHeight),
            new Vector(-this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, 0)
        ]);

        return p;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }

    get halfWidth () {
        return this.width / 2;
    }

    get halfHeight () {
        return this.height / 2;
    }

    fall () {
        this.velocity.z = GRAVITY;
    }

    stopFalling () {
        this.velocity.z = 0;
    }

    moveUp () {
        this.reverse = false;
        this.velocity.x = -SPEED * Math.cos(this.angle);
        this.velocity.y = -SPEED * Math.sin(this.angle);
    }

    moveDown () {
        this.reverse = true;
        this.velocity.x = SPEED * Math.cos(this.angle);
        this.velocity.y = SPEED * Math.sin(this.angle);
    }

    turnRight () {
        this.angularVelocity = -ROTATION_SPEED * (Math.PI / 180);
    }

    turnLeft () {
        this.angularVelocity = ROTATION_SPEED * (Math.PI / 180);
    }

    get angleDegree () {
        return (this.angle / (Math.PI / 180)) % 360;
    }

    stopMoving () {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    stopTurning () {
        this.angularVelocity = 0;
    }

    update (delta) {
        if (delta === 0) {
            return;
        }

        this.angle += this.angularVelocity * delta;

        // Normalize radian
        this.angle %= Math.PI * 2;

        if (this.angle < 0) {
            this.angle = (Math.PI * 2) - this.angle;
        }

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;
    }
}

module.exports = Player;
