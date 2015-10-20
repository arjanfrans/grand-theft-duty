let debug = require('debug')('game:engine/player');

let Bodies = require('matter-js').Bodies;
let Body = require('matter-js').Body;

const SPEED = 300;
const ROTATION_SPEED = 300;

class Player {
    constructor (x, y, z = 0, width = 32, height = 32) {
        this.z = z;

        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };

        this.angularVelocity = 0;

        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle(x, y, width, height);
    }

    get position () {
        return {
            x: this.body.position.x,
            y: this.body.position.y,
            z: this.z
        };
    }

    set angle (angle) {
        this.body.angle = angle;
    }

    get angle () {
        return this.body.angle;
    }

    moveUp () {
        this.velocity.x = -SPEED * Math.cos(this.angle);
        this.velocity.y = -SPEED * Math.sin(this.angle);
    }

    moveDown () {
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

        this.body.position.x += this.velocity.x * delta;
        this.body.position.y += this.velocity.y * delta;
    }
}

module.exports = Player;
