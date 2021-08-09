import { Matrix4, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import {View} from '../../../engine/graphics/View';

class HealthView extends View {
    constructor (state) {
        super();

        this.player = state.player;
        this._healthScale = 1;
    }

    init () {
        const material = new MeshBasicMaterial({
            color: 0xcc0000
        });

        this.geometry = new PlaneGeometry(200, 20);

        // Change originX to left side
        this.geometry.applyMatrix(new Matrix4().makeTranslation(100, 0, 0));

        this.mesh = new Mesh(this.geometry, material);

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

                const oldX = this.mesh.position.x;

                this.mesh.scale.set(value, 1, 1);
                this.mesh.position.x = oldX;
            }
        }
    }

    update () {
        this.healthScale = this.player.health / this.player.maxHealth;
    }
}

export default HealthView;
