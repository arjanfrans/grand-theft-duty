let debug = require('debug')('game:engine/ui/StatsRenderView');

import RenderView from '../../engine/graphics/RenderView';
import AmmoView from './AmmoView';
import HealthView from './HealthView';
import WeaponView from './WeaponView';
import ScoreView from './ScoreView';

// TODO fix duplicate code of subviews
class StatsRenderView extends RenderView {
    constructor (stats) {
        super();

        this.stats = stats;
        this.ammoView = new AmmoView();
        this.healthView = new HealthView();
        this.scoreView = new ScoreView();
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(0, this.width,
            this.height, 0, 0, 1);

        this.ammoView.init();
        this.ammoView.position = {
            x: 32,
            y: this.height - 64
        };

        this.scene.add(this.ammoView.mesh);

        this.healthView.init();
        this.healthView.position = {
            x: this.width - 210,
            y: this.height - 30
        };

        this.scene.add(this.healthView.mesh);

        this.weaponView = new WeaponView();

        this.weaponView.init();
        this.weaponView.position = {
            x: this.width - 96,
            y: 40
        };

        this.weaponView.mesh.width = 2;

        this.scene.add(this.weaponView.mesh);

        this.scoreView.init();

        this.scoreView.position = {
            x: 100,
            y: 100
        };

        this.scene.add(this.scoreView.mesh);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);

        if (this.stats.player.currentWeapon) {
            let weapon = this.stats.player.currentWeapon;

            this.weaponView.weapon = weapon.name;

            this.ammoView.ammo = weapon.ammo;
            this.ammoView.magazine = weapon.magazine;
        } else {
            this.weaponView.weapon = null;

            this.ammoView.ammo = null;
            this.ammoView.magazine = null;
        }

        this.scoreView.updateStats(this.stats);

        let healthScale = this.stats.player.health / this.stats.player.maxHealth;

        this.healthView.healthScale = healthScale;
    }

}

export default StatsRenderView;
