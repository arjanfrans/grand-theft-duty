let debug = require('debug')('game:entities/player');
let Gun = require('./Gun');

const PHYSICS_ENGINE = Phaser.Physics.ARCADE;
const ANIMATION_FRAME_RATE = 15;
const SPRITE_SCALE = 2;
const FIRE_KEY = Phaser.Keyboard.SPACEBAR;
const WALKING_SPEED = 300;

var _animations = {};
let _sprite = null;
let _cursorInput = null;
let _fireInput = null;
let _state = 'idle';
let _gun = null;
let _collisionHandler = null;

let updateAnimations = function () {
   let isWalking = _cursorInput.up.isDown || _cursorInput.down.isDown;

    if (isWalking && _state !== 'walk') {
        _animations.walk.play();
        _state = 'walk';
    } else if (_state !== 'idle') {
        _animations.idle.play();
        _state = 'idle';
    }
};

let updateInput = function () {
    if (_cursorInput.up.isDown) {
        game.physics.arcade.velocityFromAngle(_sprite.angle + 90, WALKING_SPEED * -1, _sprite.body.velocity);
    } else if (_cursorInput.down.isDown){
        game.physics.arcade.velocityFromAngle(_sprite.angle + 90, WALKING_SPEED, _sprite.body.velocity);
    }

    if (_cursorInput.left.isDown) {
        _sprite.body.angularVelocity = WALKING_SPEED * -1;
    } else if (_cursorInput.right.isDown) {
        _sprite.body.angularVelocity = WALKING_SPEED;
    }

    if (_fireInput.isDown) {
        debug('fire');
        _gun.fire();
    }
};

export let setCollisionHandler = function (collisionHandler) {
    _collisionHandler = collisionHandler;
};

export let preload = function () {
    game.load.atlas('character.dude', 'assets/images/character/dude.png', 'assets/images/character/dude.json');
};

export let create = function (positionX, positionY, cameraFollow) {
    // Sprite
    _sprite = game.add.sprite(positionX, positionY, 'character.dude');
    _sprite.scale.set(SPRITE_SCALE);
    _sprite.anchor.setTo(0.5, 0.5);

    // Animations
    let walkFrameNames = Phaser.Animation.generateFrameNames('dude_walk_', 1, 7, '.png', 4);
    let idleFrameNames = ['dude_idle_0001.png'];

    _animations.walk = _sprite.animations.add('walk', walkFrameNames, ANIMATION_FRAME_RATE, true);
    _animations.idle = _sprite.animations.add('idle', idleFrameNames, ANIMATION_FRAME_RATE, true);

    // Physics
    game.physics.enable(_sprite, PHYSICS_ENGINE);
    _sprite.body.collideWorldBounds = true;

    // Input
    _cursorInput = game.input.keyboard.createCursorKeys()
    _fireInput = game.input.keyboard.addKey(FIRE_KEY);

    // Camera
    if (cameraFollow) {
        game.camera.follow(_sprite, Phaser.Camera.FOLLOW_TOPDOWN);
    }

    // Gun
    _gun = new Gun(_sprite);
};

export let update = function () {
    // Reset velocity
    _sprite.body.velocity.x = 0;
    _sprite.body.velocity.y = 0;
    _sprite.body.angularVelocity = 0;

    updateAnimations();
    updateInput();

    if (_collisionHandler) {
        _collisionHandler(_sprite);
    }
};

export let render = function () {
    if (game.globals.debug) {
        game.debug.spriteCoords(_sprite, 32, 500);
    }
}
