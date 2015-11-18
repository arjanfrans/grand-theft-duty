let debug = require('debug')('game:engine/ui/StatsRenderView');

import RenderView from '../../engine/graphics/RenderView';
import AmmoView from './AmmoView';
import HealthView from './HealthView';
import WeaponView from './WeaponView';

// TODO fix duplicate code of subviews
class StatsRenderView extends RenderView {
    constructor (stats) {
        super();

        this.stats = stats;
        this.ammoView = new AmmoView();
        this.healthView = new HealthView();
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
            x: this.width - 192,
            y: this.height - 64
        };

        this.scene.add(this.healthView.mesh);

        let weaponView = new WeaponView();

        weaponView.init();
        weaponView.position = {
            x: this.width - 96,
            y: 40
        };

        weaponView.mesh.width = 2;

        this.scene.add(weaponView.mesh);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);

        this.ammoView.ammo = this.stats.player.ammo;
    }

}

export default StatsRenderView;
