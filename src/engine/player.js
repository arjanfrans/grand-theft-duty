let debug = require('debug')('game:engine/player');
const SPEED = 10;

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
        this.width = width;
        this.height = height;
    }

    moveUp () {
        this.velocity.y += 10;
    }

    stopMoving () {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    update (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;
    }
}

module.exports = Player;
