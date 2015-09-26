let map = {
    instance: null,

    layers: {},

    preload: function () {
        game.load.tilemap('map_test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset_test', 'assets/maps/spritesheet.png');
    },

    create: function () {
        this.instance = game.add.tilemap('map_test');
        this.instance.addTilesetImage('main', 'tileset_test');
        this.layers.ground = this.instance.createLayer('ground');
    }
};

module.exports = {
    preload: function () {
        map.preload();

        game.load.image('player', 'assets/phaser-dude.png');

    },

    create: function(){
        map.create();

        game.world.setBounds(0, 0, 1920, 1920);
        game.physics.startSystem(Phaser.Physics.P2JS);

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
