import ObjectPool from '../../engine/utils/ObjectPool';

import SoldierView from './SoldierView';
import View from '../../engine/views/View';

class SoldierViewPool extends View {
    constructor (soldiers) {
        super();

        this.soldiers = soldiers;

        this.viewPool = new ObjectPool(() => {
            return new SoldierView(null);
        }, this.soldiers.size, 10);

        this.viewPairs = new WeakMap();
    }

    init () {
        this.mesh = new THREE.Object3D();
        this._initialized = true;
    }

    update (interpolationPercentage) {
        // Keep viewPool in sync with soldier pool
        if (this.viewPool.poolSize > this.soldiers.length + 1) {
            this.viewPool.allocate(this.soldiers.length + 1 - this.viewPool.size);
        }

        for (let soldier of this.soldiers) {
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
