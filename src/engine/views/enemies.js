import ObjectPool from '../object-pool';

// TODO make an enemy view
import PlayerView from './player';

class EnemiesView {
    constructor (enemies) {
        this.enemies = enemies;

        this.viewPool = new ObjectPool(() => {
            return new PlayerView(null);
        }, this.enemies.length, 10);

        this.viewPairs = new WeakMap();
    }

    init () {
        this.mesh = new THREE.Object3D();
    }

    update (delta) {
        // Keep viewPool in sync with enemy pool
        if (this.viewPool.poolSize > this.enemies.length) {
            this.viewPool.allocate(this.enemies.length - this.viewPool.size);
        }

        for (let enemy of this.enemies) {
            let view = this.viewPairs.get(enemy);

            if (!view && !enemy.dead) {
                view = this.viewPool.get();

                // FIXME not player
                view.player = enemy;
                view.init();

                this.mesh.add(view.mesh);

                this.viewPairs.set(enemy, view);
            } else if (view) {
                view.update(delta);

                if (enemy.dead && this.viewPairs.has(enemy)) {
                    this.viewPool.free(view);
                    this.viewPairs.delete(enemy);
                }
            }
        }
    }
}

export default EnemiesView;
