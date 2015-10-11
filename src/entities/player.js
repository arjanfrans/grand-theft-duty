let debug = require('debug')('game:entities/player');
let Character = require('./character');

class Player extends Character {

    constructor(spriteName, cameraFollow) {
        super(spriteName);

        this.cameraFollow = cameraFollow;
        this.cursorInput = null;
        this.fireInput = null;
    }

    create (positionX, positionY) {
        super.create(positionX, positionY);

        this.cursorInput = game.input.keyboard.createCursorKeys();
        this.fireInput = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

        // Camera
        if (this.cameraFollow) {
            game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
        }
    }

    isWalking () {
        return this.cursorInput.up.isDown || this.cursorInput.down.isDown;
    }

    move () {
        if (this.cursorInput.up.isDown) {
            game.physics.arcade.velocityFromAngle(this.sprite.angle + 90, this.speed * -1, this.sprite.body.velocity);
        } else if (this.cursorInput.down.isDown){
            game.physics.arcade.velocityFromAngle(this.sprite.angle + 90, this.speed, this.sprite.body.velocity);
        }

        if (this.cursorInput.left.isDown) {
            this.sprite.body.angularVelocity = this.speed * -1;
        } else if (this.cursorInput.right.isDown) {
            this.sprite.body.angularVelocity = this.speed;
        }
    }

    fireGun () {
        if (this.alive) {
            if (this.fireInput.isDown) {
                debug('fire');
                this.gun.fire();
            }
        }
    }
};

module.exports = Player;
