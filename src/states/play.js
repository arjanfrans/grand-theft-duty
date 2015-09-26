let debug = require('debug')('game:states/play.js');

let map = {
    instance: null,

    layers: {},

    physics: function () {
        this.instance.setCollisionByExclusion([], true, this.layers.walls);

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

let bulletTime = 0;

let player = {
    state: 'idle',

    animations: {},

    instance: null,

    bullets: null,

    cursors: null,

    fireButton: null,

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
        this.instance.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.instance, Phaser.Physics.ARCADE);
        this.instance.body.collideWorldBounds = true;

        this.cursors = game.input.keyboard.createCursorKeys()

            this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    fire: function () {
        if (game.time.now > bulletTime) {
            let bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.instance.x, this.instance.y);

                bullet.angle = this.instance.angle;
                game.physics.arcade.velocityFromAngle(bullet.angle + 90, -600, bullet.body.velocity);
                bulletTime = game.time.now + 200;
            }
        }
    },

    update: function () {
        this.instance.body.velocity.x = 0;
        this.instance.body.velocity.y = 0;
        this.instance.body.angularVelocity = 0;

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

        if (this.fireButton.isDown) {
            this.fire();
        }

        if (this.cursors.up.isDown) {
            game.physics.arcade.velocityFromAngle(this.instance.angle + 90, -300, this.instance.body.velocity);
        } else if (this.cursors.down.isDown){
            game.physics.arcade.velocityFromAngle(this.instance.angle + 90, 300, this.instance.body.velocity);
        }

        if (this.cursors.left.isDown) {
            this.instance.body.angularVelocity = -300;
        } else if (this.cursors.right.isDown) {
            this.instance.body.angularVelocity = 300;
        }
    }
};

module.exports = {
    preload: function () {
        map.preload();
        player.preload();
        game.load.image('bullet', 'assets/images/bullet.png');
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map.create();

        player.create(game.world.centerX, game.world.centerY);

        game.camera.follow(player.instance, Phaser.Camera.FOLLOW_TOPDOWN);
    },

    update: function(){
        player.update();
        game.physics.arcade.collide(player.instance, map.layers.walls)
        game.physics.arcade.collide(player.bullets, map.layers.walls, bulletWallCollision)
    },

    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player.instance, 32, 500);
    }
};

function bulletWallCollision (bullet, wall) {
    bullet.kill();
}
