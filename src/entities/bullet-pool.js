let debug = require('debug')('game:entities/bullet-pool');

const PHYSICS_ENGINE = Phaser.Physics.ARCADE;
const BULLET_COUNT = 50;

let bullets = null;

export let preload = function () {
    debug('preloaded bullet-pool');
    game.load.image('object.bullet', 'assets/images/bullet.png');
};

export let create = function () {
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = PHYSICS_ENGINE;

    bullets.createMultiple(BULLET_COUNT, 'object.bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
};

export let getBullets = function () {
    return bullets;
};
