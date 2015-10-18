let debug = require('debug')('game:engine/player');
const SPEED = 300;
const ROTATION_SPEED = 300;

class Player {
    constructor (x, y, z = 0, angle = 0, width = 32, height = 32) {
        this.position = {
            x: x,
            y: y,
            z: z
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.angularVelocity = 0;

        // Angle in degrees
        this.angle = 0;

        this.width = width;
        this.height = height;
    }

    moveUp () {
        this.velocity.x = SPEED * Math.cos(this.angle);
        this.velocity.y = SPEED * Math.sin(this.angle);
    }

    moveDown () {
        this.velocity.x = -SPEED * Math.cos(this.angle);
        this.velocity.y = -SPEED * Math.sin(this.angle);
    }

    turnRight () {
        this.angularVelocity = -ROTATION_SPEED * (Math.PI / 180);
    }

    turnLeft () {
        this.angularVelocity = ROTATION_SPEED * (Math.PI / 180);
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

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    }
}

module.exports = Player;
