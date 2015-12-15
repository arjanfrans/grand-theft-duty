import { TextureManager, Animation, View } from '../../../engine/graphics';

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

const TEAM_COLORS = {
    american: 0x006D02,
    german: 0xcccc00
};

class SoldierView extends View {
    constructor (soldier) {
        super();

        this.soldier = soldier;
        this._team = soldier ? soldier.team : 'american';
    }

    set team (team) {
        if (team !== this._team) {
            this._team = team;
            this.material.color.setHex(TEAM_COLORS[team]);
        }
    }

    init () {
        let soldier = this.soldier;

        this.geometry = new THREE.PlaneGeometry(soldier.height * 2, soldier.width * 2);

        this.geometry.rotateZ(Math.PI);

        let textureAtlas = TextureManager.getAtlas('soldier', true);

        this.animations = {
            walk: new Animation(textureAtlas, this.geometry, 9, true, WALK_FRAMES, 'soldier_weapon_'),
            run: new Animation(textureAtlas, this.geometry, 5, true, RUN_FRAMES, 'soldier_weapon_'),
            idle: new Animation(textureAtlas, this.geometry, 8, true, IDLE_FRAMES, 'soldier_weapon_')
        };

        this.currentAnimation = this.animations.idle;

        this.material = new THREE.MeshLambertMaterial({
            map: textureAtlas.texture,
            transparent: true,
            color: TEAM_COLORS[this._team]
        });

        this.material.color.offsetHSL(0.1, 0.8, 0.4);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(soldier.position.x, soldier.position.y, soldier.position.z);
        this.mesh.rotation.z = soldier.angle;

        super.init();
    }

    _updateAnimation () {
        let animation = this.currentAnimation;

        if (this.soldier.isMoving) {
            if (this.soldier.isRunning) {
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
        let zOffset = this.soldier.depth;

        if (this.soldier.dead) {
            this.mesh.visible = false;
            zOffset = 0;
        } else if (!this.mesh.visible) {
            this.mesh.visible = true;
        }

        let previous = this.soldier.previousPosition;
        let current = this.soldier.position;

        this.mesh.position.x = previous.x + (current.x - previous.x) * interpolationPercentage;
        this.mesh.position.y = previous.y + (current.y - previous.y) * interpolationPercentage;
        this.mesh.position.z = previous.z + (current.z - previous.z) * interpolationPercentage;

        this.mesh.position.z += zOffset;

        this.mesh.rotation.z = this.soldier.angle + (90 * (Math.PI / 180));

        this._updateAnimation();
    }
}

export default SoldierView;
