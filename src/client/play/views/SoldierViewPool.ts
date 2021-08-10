import { Object3D } from 'three';
import {ObjectPool} from '../../../engine/ObjectPool';
import {View} from '../../../engine/graphics/View';
import SoldierView from './SoldierView';
import {Soldier} from "../../../core/entities/Soldier";

export class SoldierViewPool extends View {
    private readonly soldiers: Set<Soldier>;
    private viewPool: ObjectPool<SoldierView>;
    private viewPairs: WeakMap<Soldier, SoldierView>;

    constructor (soldiers: Set<Soldier>, poolLimit?: number) {
        super();

        this.soldiers = soldiers;

        this.viewPool = new ObjectPool<SoldierView>((): SoldierView => {
            return new SoldierView(null);
        }, this.soldiers.size, 10, poolLimit || 200);

        this.viewPairs = new WeakMap();
    }

    init () {
        this.mesh = new Object3D();
        this._initialized = true;
    }

    update (interpolationPercentage) {
        // Keep viewPool in sync with soldier pool
        if (this.viewPool.size > this.soldiers.size) {
            this.viewPool.allocate(this.soldiers.size - this.viewPool.size);
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
