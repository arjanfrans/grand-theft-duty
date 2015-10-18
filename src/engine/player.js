let debug = require('debug')('game:engine/player');
const SPEED = 300;
const ROTATION_SPEED = 300;

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

        this.angleRadian = 90 * (Math.PI / 180);

        this.width = width;
        this.height = height;
        this.collidable = true;
    }

    moveUp () {
        this.velocity.x = SPEED * Math.cos(this.angleRadian);
        this.velocity.y = SPEED * Math.sin(this.angleRadian);
    }

    moveDown () {
        this.velocity.x = -SPEED * Math.cos(this.angleRadian);
        this.velocity.y = -SPEED * Math.sin(this.angleRadian);
    }

    turnRight () {
        this.angularVelocity = -ROTATION_SPEED * (Math.PI / 180);
    }

    turnLeft () {
        this.angularVelocity = (ROTATION_SPEED * (Math.PI / 180)) % (Math.PI * 2);
    }

    get angleDegree () {
        return (this.angleRadian / (Math.PI / 180)) % 360;
    }

    onWallCollision () {
        this.velocity.x = 0;
        this.velocity.y = 0;
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

        this.angleRadian += this.angularVelocity * delta;

        // Normalize radian
        this.angleRadian %= Math.PI * 2;

        if (this.angleRadian < 0) {
            this.angleRadian = (Math.PI * 2) - this.angleRadian;
        }

        console.log(this.angleDegree);

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    }
}

module.exports = Player;
