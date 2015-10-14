const SPEED = 10;

class Player {
    constructor (x, y, width = 10, height = 10) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: 0,
            y: 0
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

    }
}

module.exports = Player;
