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
        // Keep viewPool in sync with character pool
        if (this.viewPool.poolSize > this.soldiers.length + 1) {
            this.viewPool.allocate(this.soldiers.length + 1 - this.viewPool.size);
        }

        for (let character of this.soldiers) {
            let view = this.viewPairs.get(character);

            if (!view && !character.dead) {
                view = this.viewPool.get();

                view.soldier = character;
                view.init();

                // Team is set after, because it affects the material
                view.team = character.team;

                this.mesh.add(view.mesh);

                this.viewPairs.set(character, view);
            } else if (view) {
                view.update(interpolationPercentage);

                if (character.dead && this.viewPairs.has(character)) {
                    this.viewPool.free(view);
                    this.viewPairs.delete(character);
                }
            }
        }
    }
}

export default SoldierViewPool;
