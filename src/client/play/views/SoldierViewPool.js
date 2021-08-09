import { Object3D } from 'three';
import ObjectPool from '../../../engine/ObjectPool';
import {View} from '../../../engine/graphics/View';
import SoldierView from './SoldierView';

class SoldierViewPool extends View {
    constructor (soldiers, options = {}) {
        super();

        this.soldiers = soldiers;

        this.viewPool = new ObjectPool(() => {
            return new SoldierView(null);
        }, this.soldiers.size, 10, options.poolLimit || 200);

        this.viewPairs = new WeakMap();
    }

    init () {
        this.mesh = new Object3D();
        this._initialized = true;
    }

    update (interpolationPercentage) {
        // Keep viewPool in sync with soldier pool
        if (this.viewPool.poolSize > this.soldiers.length + 1) {
            this.viewPool.allocate(this.soldiers.length + 1 - this.viewPool.size);
        }

        for (const soldier of this.soldiers) {
            let view = this.viewPairs.get(soldier);

            if (!view && !soldier.dead) {
                view = this.viewPool.get();

                view.soldier = soldier;
                view.init();

                // Team is set after, because it affects the material
                view.team = soldier.team;

                this.mesh.add(view.mesh);

                this.viewPairs.set(soldier, view);
            } else if (view) {
                view.update(interpolationPercentage);

                if (soldier.dead && this.viewPairs.has(soldier)) {
                    this.viewPool.free(view);
                    this.viewPairs.delete(soldier);
                }
            }
        }
    }
}

export default SoldierViewPool;
