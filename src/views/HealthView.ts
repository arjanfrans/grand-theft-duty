import {Geometry, Matrix4, Mesh, MeshBasicMaterial, PlaneGeometry} from 'three';
import {View} from '../engine/graphics/View';
import {SoldierComponent} from "../ecs/components/SoldierComponent";
import {Entity} from "../ecs/Entity";

export class HealthView extends View {
    private player: Entity;
    private _healthScale: number = 1;

    constructor (state) {
        super();

        this.player = state.getPlayerEntity();
    }

    init () {
        const material = new MeshBasicMaterial({
            color: 0xcc0000
        });

        const geometry = new PlaneGeometry(200, 20);

        // Change originX to left side
        geometry.applyMatrix(new Matrix4().makeTranslation(100, 0, 0));

        this.mesh = new Mesh(geometry, material);

        super.init();
    }

    set healthScale (value) {
        if (value !== this._healthScale) {
            const mesh = this.mesh as Mesh;

            this._healthScale = value;

            if (value <= 0) {
                mesh.visible = false;
            } else {
                if (!mesh.visible) {
                    mesh.visible = true;
                }

                const oldX = mesh.position.x;

                mesh.scale.set(value, 1, 1);
                mesh.position.x = oldX;
            }
        }
    }

    update () {
        const soldierComponent = this.player.getComponent<SoldierComponent>(SoldierComponent.TYPE);

        this.healthScale = soldierComponent.health / soldierComponent.maxHealth;
    }
}
