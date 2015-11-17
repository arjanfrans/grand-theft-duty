let debug = require('debug')('game:engine/views/player');

import TextureAtlas from '../../engine/graphics/TextureAtlas';
import Animation from '../../engine/graphics/Animation';
import View from '../../engine/views/View';

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
            walk: new Animation(this.textureAtlas, this.geometry, 8, true, WALK_FRAMES, 'dude_'),
            idle: new Animation(this.textureAtlas, this.geometry, 8, true, IDLE_FRAMES, 'dude_')
        };

        this.material = new THREE.MeshBasicMaterial({
            map: this.textureAtlas.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(player.position.x, player.position.y, player.position.z);
        this.mesh.rotation.z = player.angle;

        this._initialized = true;
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

    update (interpolationPercentage) {
        if (this.player.dead) {
            this.mesh.visible = false;
        }

        let previous = this.player.previousPosition;
        let current = this.player.position;

        this.mesh.position.x = previous.x + (current.x - previous.x) * interpolationPercentage;
        this.mesh.position.y = previous.y + (current.y - previous.y) * interpolationPercentage;
        this.mesh.position.z = previous.z + (current.z - previous.z) * interpolationPercentage;

        this.mesh.rotation.z = this.player.angle + (90 * (Math.PI / 180))

        let currentAnimation = this._currentAnimation();

        currentAnimation.update(interpolationPercentage);
    }
}

export default PlayerView;
