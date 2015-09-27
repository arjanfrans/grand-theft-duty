let debug = require('debug')('game:entities/Gun');
let bulletPool = require('./bullet-pool');

const PHYSICS_ENGINE = Phaser.Physics.ARCADE;
const BULLET_COUNT = 50;

class Gun {

    constructor (owner) {
        bulletPool.create();
        this.owner = owner;
        this.fireRate = 200;
        this.bulletSpeed = 600;
        this.bulletTime = 0;
        this.bullets = bulletPool.getBullets();
    }

    fire () {
        if (game.time.now > this.bulletTime) {
            let bullet = this.bullets.getFirstExists(false);

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
