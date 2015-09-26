let debug = require('debug')('game:states/play.js');

let map = {
    instance: null,

    layers: {},

    physics: function () {
        this.instance.setCollisionByExclusion([], true, this.layers.walls);

        game.physics.p2.convertTilemap(this.instance, this.layers.walls);
        game.physics.setBoundsToWorld(true, true, true, true, false);
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

let player = {
    state: 'idle',

    animations: {},

    updateState: function (previousState, newState) {
        debug('newState', newState);
        this.state = newState;

        if (newState !== previousState) {
            if (newState === 'walk') {
                debug('current state', 'walk');
                this.animations.walk.play(10, true);
            }

            // Otherwise idle
            debug('current state', 'idle');
            this.animations.idle.play(10, true);
        }
    },

    instance: null,

    cursors: null,

    preload: function () {

        game.load.atlas('player_atlas', 'assets/images/character/dude.png', 'assets/images/character/dude.json');
    },

    create: function (positionX, positionY) {
        this.instance = game.add.sprite(positionX, positionY, 'player_atlas');
        let walkFrameNames = Phaser.Animation.generateFrameNames('dude_walk_', 1, 7, '.png', 4);
        let idleFrameNames = ['dude_idle_0001.png'];

        this.animations.walk = this.instance.animations.add('walk', walkFrameNames, 10, true);
        this.animations.idle = this.instance.animations.add('idle', idleFrameNames, 10, true);

        this.instance.scale.set(2);

        this.cursors = game.input.keyboard.createCursorKeys()
    },

    update: function () {
        this.instance.body.setZeroVelocity();
        this.instance.body.setZeroRotation();

        let previousState = this.state;

        let isWalking = this.cursors.up.isDown || this.cursors.down.isDown;

        if (isWalking) {
            if (this.state !== 'walk') {
                this.animations.walk.play();
                this.state = 'walk';
            }
        } else {
            if (this.state !== 'idle') {
                player.animations.idle.play();
                this.state = 'idle';
            }
        }

        if (this.cursors.up.isDown) {
            this.instance.body.moveForward(300)
        } else if (this.cursors.down.isDown){
            this.instance.body.moveBackward(300);
        }

        if (this.cursors.left.isDown) {
            this.instance.body.rotateLeft(100);
        } else if (this.cursors.right.isDown) {
            this.instance.body.rotateRight(100);
        }
    }
};

module.exports = {
    preload: function () {
        map.preload();
        player.preload();
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.P2JS);
        map.create();

        player.create(game.world.centerX, game.world.centerY);

        game.physics.p2.enable(player.instance);

        game.camera.follow(player.instance);
    },
    update: function(){
        player.update();
    },

    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player.instance, 32, 500);
    }
};
