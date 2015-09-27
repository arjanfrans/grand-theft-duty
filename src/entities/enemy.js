let debug = require('debug')('game:entities/enemy');
let Character = require('./character');

class Enemy extends Character {

    constructor(spriteName) {
        super(spriteName);
    }

    create (positionX, positionY) {
        super.create(positionX, positionY);
    }

    isWalking () {
        return false;
    }

    move () {

    }

    fireGun () {
        if (game.rnd.integerInRange(0, 10) === 5) {
            this.gun.fire();
        }
    }
};

module.exports = Enemy;
