let debug = require('debug')('game:engine/views/player');

import TextureAtlas from '../graphics/texture-atlas';
import Animation from '../graphics/animation';
import View from './view';

const WALK_FRAMES = ['walk_0001', 'walk_0002', 'walk_0003', 'walk_0004'];
const IDLE_FRAMES = ['idle_0001'];

class PlayerView extends View {
    constructor (player) {
        super();

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
        if (this.player.dead) {
            this.mesh.visible = false;
        }

        this.mesh.position.x = this.player.position.x;
        this.mesh.position.y = this.player.position.y;
        this.mesh.position.z = this.player.position.z;

        this.mesh.rotation.z = this.player.angle;

        let currentAnimation = this._currentAnimation();

        currentAnimation.update(delta);
    }
}

export default PlayerView;
