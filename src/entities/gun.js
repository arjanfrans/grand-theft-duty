let debug = require('debug')('game:entities/gun');

const BULLET_COUNT = 50;

class Gun {

    constructor () {
        this.owner = null;
        this.fireRate = 200;
        this.bulletSpeed = 600;
        this.bulletTime = 0;
        this.bullets = null;
    }

    preload () {
        game.load.image('object.bullet', 'assets/images/bullet.png');
    }

    create (owner) {
        this.owner = owner;

        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(BULLET_COUNT, 'object.bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
    }

    getBullets () {
        return this.bullets;
    }

    fire () {
        if (game.time.now > this.bulletTime) {
            let bullet = this.bullets.getFirstExists(false);
            debug('bullet', bullet);

            if (bullet) {
                bullet.reset(this.owner.x, this.owner.y);

                bullet.angle = this.owner.angle;
                game.physics.arcade.velocityFromAngle(bullet.angle + 90, this.bulletSpeed * -1, bullet.body.velocity);
                this.bulletTime = game.time.now + this.fireRate;
            }
        }
    }
}

module.exports = Gun;
