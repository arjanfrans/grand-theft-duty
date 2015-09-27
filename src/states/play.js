let debug = require('debug')('game:states/play');

let Player = require('../entities/player');
let Enemy = require('../entities/enemy');
let Map = require('../map');

let map = new Map();
let player = new Player('dude', true);
let enemy = new Enemy('dude');

var bulletsWithWallCollisions = function () {
    game.physics.arcade.collide(player.getGun().getBullets(), map.getLayers().walls, (bullet, wall) => {
        bullet.kill();
    });

    game.physics.arcade.collide(enemy.getGun().getBullets(), map.getLayers().walls, (bullet, wall) => {
        bullet.kill();
    });
};

module.exports = {
    preload: function () {
        map.preload();
        player.preload();
        enemy.preload();
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map.create();

        player.create(game.world.centerX, game.world.centerY);
        player.setCollisionHandler(function (sprite) {
            game.physics.arcade.collide(sprite, map.layers.walls)
        });

        enemy.create(game.world.randomX, game.world.randomY);
        enemy.setCollisionHandler(function (sprite) {
            game.physics.arcade.collide(sprite, map.layers.walls)
        });
    },

    update: function(){
        player.update();
        enemy.update();

        bulletsWithWallCollisions();
    },

    render: function() {
        if (game.globals.debug) {
            game.debug.cameraInfo(game.camera, 32, 32);
        }
    }
};
