let debug = require('debug')('game:engine/views/player');

import TextureManager from '../../engine/graphics/TextureManager';
import Animation from '../../engine/graphics/Animation';
import View from '../../engine/views/View';

const WALK_FRAMES = [
    'walk_0001',
    'walk_0002',
    'walk_0003',
    'walk_0004',
    'walk_0005',
    'walk_0006',
    'walk_0007',
    'walk_0008'
];

const RUN_FRAMES = [
    'run_0001',
    'run_0002',
    'run_0003',
    'run_0004',
    'run_0005',
    'run_0006',
    'run_0007',
    'run_0008'
];

const IDLE_FRAMES = ['idle_0001'];

class PlayerView extends View {
    constructor (player) {
        super();

        this.player = player;
    }

    init () {
        let player = this.player;

        this.geometry = new THREE.PlaneGeometry(player.height * 2, player.width * 2);

        this.geometry.rotateZ(Math.PI);

        let textureAtlas = TextureManager.getAtlas('soldier', true);

        this.animations = {
            walk: new Animation(textureAtlas, this.geometry, 9, true, WALK_FRAMES, 'soldier_weapon_'),
            run: new Animation(textureAtlas, this.geometry, 5, true, RUN_FRAMES, 'soldier_weapon_'),
            idle: new Animation(textureAtlas, this.geometry, 8, true, IDLE_FRAMES, 'soldier_weapon_')
        };

        this.currentAnimation = this.animations.idle;

        this.material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true,
            color: 0x006D02
        });

        // TODO make color configurable
        this.material.color.offsetHSL(0.1, 0.9, 0.2);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(player.position.x, player.position.y, player.position.z);
        this.mesh.rotation.z = player.angle;

        this._initialized = true;
    }

    _updateAnimation () {
        let animation = this.currentAnimation;

        if (this.player.isMoving) {
            if (this.player.isRunning) {
                animation = this.animations.run;
            } else {
                animation = this.animations.walk;
            }
        } else {
            animation = this.animations.idle;
        }

        // Animation changed
        if (animation !== this.currentAnimation) {
            this.currentAnimation = animation;
            this.currentAnimation.reset();
        }

        this.currentAnimation.update();
    }

    update (interpolationPercentage) {
        let zOffset = this.player.depth;

        if (this.player.dead) {
            this.mesh.visible = false;
            zOffset = 0;
        } else if (!this.mesh.visible) {
            this.mesh.visible = true;
        }

        let previous = this.player.previousPosition;
        let current = this.player.position;

        this.mesh.position.x = previous.x + (current.x - previous.x) * interpolationPercentage;
        this.mesh.position.y = previous.y + (current.y - previous.y) * interpolationPercentage;
        this.mesh.position.z = previous.z + (current.z - previous.z) * interpolationPercentage;

        this.mesh.position.z += zOffset;

        this.mesh.rotation.z = this.player.angle + (90 * (Math.PI / 180));

        this._updateAnimation();
    }
}

export default PlayerView;
