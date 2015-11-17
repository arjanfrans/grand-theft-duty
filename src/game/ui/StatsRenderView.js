let debug = require('debug')('game:engine/ui/StatsRenderView');

import TextureAtlas from '../../engine/graphics/TextureAtlas';
import RenderView from '../../engine/graphics/RenderView';
import AmmoView from './AmmoView';
import HealthView from './HealthView';
import WeaponView from './WeaponView';

// TODO fix duplicate code of subviews
class StatsRenderView extends RenderView {
    constructor () {
        super();

        this.width = 800;
        this.height = 600;
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2,
            this.height / 2, -this.height / 2, 0, 1);

        this.camera = new THREE.OrthographicCamera(0, this.width,
            this.height, 0, 0, 1);

        let ammoView = new AmmoView();

        ammoView.init();
        ammoView.position = {
            x: 32,
            y: this.height - 64
        };

        this.scene.add(ammoView.mesh);

        let healthView = new HealthView();

        healthView.init();
        healthView.position = {
            x: this.width - 192,
            y: this.height - 64
        };

        this.scene.add(healthView.mesh);

        let weaponView = new WeaponView();

        weaponView.init();
        weaponView.position = {
            x: this.width - 96,
            y: 40
        };

        this.scene.add(weaponView.mesh);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }

}

export default StatsRenderView;
