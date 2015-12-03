let debug = require('debug')('game:game/ui/HealthView');

import View from '../../engine/views/View';

class HealthView extends View {
    constructor (state) {
        super();

        this.player = state.player;
        this._healthScale = 1;
    }

    init () {
        let material = new THREE.MeshBasicMaterial({
            color: 0xcc0000
        });

        this.geometry = new THREE.PlaneGeometry(200, 20);

        // Change originX to left side
        this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(100, 0, 0));

        this.mesh = new THREE.Mesh(this.geometry, material);

        super.init();
    }

    set healthScale (value) {
        if (value !== this._healthScale) {
            this._healthScale = value;

            if (value <= 0) {
                this.mesh.visible = false;
            } else {
                if (!this.mesh.visible) {
                    this.mesh.visible = true;
                }

                let oldX = this.mesh.position.x;

                this.mesh.scale.set(value, 1, 1);
                this.mesh.position.x = oldX;
            }
        }
    }

    update (delta) {
        this.healthScale = this.player.health / this.player.maxHealth;
    }
}

export default HealthView;
