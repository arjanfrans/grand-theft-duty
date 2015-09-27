let debug = require('debug')('game:states/play');
let bulletPool = require('../entities/bullet-pool');
let player = require('../entities/player');
let map = require('../map');

module.exports = {
    preload: function () {
        bulletPool.preload();
        map.preload();
        player.preload();
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map.create();

        player.create(game.world.centerX, game.world.centerY, true);
        player.setCollisionHandler(function (playerSprite) {
            game.physics.arcade.collide(playerSprite, map.layers.walls)
        });
    },

    update: function(){
        player.update();
        game.physics.arcade.collide(bulletPool.getBullets(), map.layers.walls, bulletWallCollisionHandler);
    },

    render: function() {
        if (game.globals.debug) {
            game.debug.cameraInfo(game.camera, 32, 32);
        }
        player.render();
    }
};

let bulletWallCollisionHandler = function (bullet, wall) {
    bullet.kill();
};


