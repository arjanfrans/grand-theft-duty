let debug = require('debug')('game:engine/player');

let Bodies = require('matter-js').Bodies;
let Body = require('matter-js').Body;

const SPEED = 3000;
const ROTATION_SPEED = 5000;

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
        this.body.friction = 1;
        this.body.frictionAir = 1;
        this.body.mass = 0.2;
        this.body.restitution = 0;
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
        this.body.force.x = -SPEED * Math.cos(this.angle);
        this.body.force.y = -SPEED * Math.sin(this.angle);
    }

    moveDown () {
        this.body.force.x = SPEED * Math.cos(this.angle);
        this.body.force.y = SPEED * Math.sin(this.angle);
    }

    turnRight () {
        this.body.torque = -ROTATION_SPEED * 50;
    }

    turnLeft () {
        this.body.torque = ROTATION_SPEED * 50;
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
    }
}

module.exports = Player;
