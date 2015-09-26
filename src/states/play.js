let debug = require('debug')('game:states/play.js');

let map = {
    instance: null,

    layers: {},

    physics: function () {
        this.instance.setCollisionByExclusion([], true, this.layers.walls);

        game.physics.p2.convertTilemap(this.instance, this.layers.walls);
        game.physics.p2.setBoundsToWorld(true, true, true, true, false);
    },

    preload: function () {
        game.load.tilemap('map_test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset_test', 'assets/maps/spritesheet.png');
    },

    create: function () {
        this.instance = game.add.tilemap('map_test');
        this.instance.addTilesetImage('main', 'tileset_test');
        this.layers.ground = this.instance.createLayer('ground');
        this.layers.walls = this.instance.createLayer('walls');

        this.layers.ground.resizeWorld();

        this.physics();
    }

};

module.exports = {
    preload: function () {
        map.preload();

        game.load.image('player', 'assets/phaser-dude.png');

    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.P2JS);
        map.create();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        game.physics.p2.enable(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(this.player);
    },
    update: function(){
        this.player.body.setZeroVelocity();

        if (this.cursors.up.isDown) {
            this.player.body.moveUp(300)
        } else if (this.cursors.down.isDown){
            this.player.body.moveDown(300);
        } if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -300;
        } else if (this.cursors.right.isDown) {
            this.player.body.moveRight(300);
        }
    },

    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(this.player, 32, 500);
    }
};
