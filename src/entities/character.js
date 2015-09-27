let debug = require('debug')('game:entities/character');
let Gun = require('./gun');

const SPRITE_SCALE = 2;
const ATLAS = 'character.dude';
const ANIMATION_FRAME_RATE = 10;
const WALKING_SPEED = 300;

let requiredMethods = ['isWalking', 'move', 'fireGun'];

class Character {

    constructor (spriteName) {
        if (!requiredMethods.every(method => typeof this[method] !== 'undefined')) {
            throw new TypeError('not all methodsimplemented.');
        }

        this.spriteName = spriteName;
        this.sprite = null;
        this.gun = new Gun();
        this.animations = {};
        this.state = 'idle';
        this.speed = WALKING_SPEED;
        this.health = 3;
        this.alive = true;

        this.collisionHandler = null;
    }

    damage () {
        this.health -= 1;

        if (this.health <= 0) {
            this.alive = false;
            this.sprite.kill();

            return true;
        }

        return false;
    };

    getGun () {
        return this.gun;
    }

    preload () {
        this.gun.preload();
        game.load.atlas(ATLAS, 'assets/images/character/dude.png', 'assets/images/character/dude.json');
    }

    create (positionX, positionY) {
        // Sprite
        this.sprite = game.add.sprite(positionX, positionY, ATLAS);
        this.sprite.scale.set(SPRITE_SCALE);
        this.sprite.anchor.setTo(0.5, 0.5);

        // Animations
        let walkFrameNames = Phaser.Animation.generateFrameNames(this.spriteName + '_walk_', 1, 7, '.png', 4);
        let idleFrameNames = [this.spriteName + '_idle_0001.png'];

        this.animations.walk = this.sprite.animations.add('walk', walkFrameNames, ANIMATION_FRAME_RATE, true);
        this.animations.idle = this.sprite.animations.add('idle', idleFrameNames, ANIMATION_FRAME_RATE, true);

        // Physics
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;

        // Gun
        this.gun.create(this.sprite);
    }

    update () {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.angularVelocity = 0;

        this.updateAnimations();
        this.move();
        this.fireGun();

        if (this.collisionHandler) {
            this.collisionHandler(this.sprite);
        }
    }

    overlapsWithBullets (bullets) {
        game.physics.arcade.overlap(bullets, this.sprite, (sprite, bullet) => {
            bullet.kill();
            this.damage();
        });
    }

    updateAnimations () {
        let isWalking = this.isWalking();

        if (isWalking && this.state !== 'walk') {
            this.animations.walk.play();
            this.state = 'walk';
        } else if (this.state !== 'idle') {
            this.animations.idle.play();
            this.state = 'idle';
        }
    }

    setCollisionHandler (collisionHandler) {
        this.collisionHandler = collisionHandler;
    }
};

module.exports = Character;
