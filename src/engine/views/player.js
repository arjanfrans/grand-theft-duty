'use strict';

let debug = require('debug')('game:engine/views/player');

let TextureAtlas = require('../graphics/texture-atlas');
let Animation = require('../graphics/animation');

const WALK_FRAMES = ['walk_0001', 'walk_0002', 'walk_0003', 'walk_0004'];
const IDLE_FRAMES = ['idle_0001'];

class PlayerView {
    constructor (player) {
        this.player = player;
    }

    init () {
        let player = this.player;

        this.geometry = new THREE.PlaneGeometry(player.width, player.height);

        this.textureAtlas = new TextureAtlas('dude');

        this.animations = {
            walk: new Animation(this.textureAtlas, this.geometry, 100, true, WALK_FRAMES, 'dude_'),
            idle: new Animation(this.textureAtlas, this.geometry, 100, true, IDLE_FRAMES, 'dude_')
        };

        this.material = new THREE.MeshBasicMaterial({
            map: this.textureAtlas.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(player.position.x, player.position.y, player.position.z);
        this.mesh.rotation.z = player.angle;
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    _currentAnimation () {
        if (this.player.isMoving) {
            return this.animations.walk;
        }

        return this.animations.idle;
    }

    update (delta) {
        this.mesh.position.x = this.player.position.x;
        this.mesh.position.y = this.player.position.y;
        this.mesh.position.z = this.player.position.z;

        this.mesh.rotation.z = this.player.angle;

        let currentAnimation = this._currentAnimation();

        currentAnimation.update(delta);
    }
}

module.exports = PlayerView;
