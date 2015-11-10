let debug = require('debug')('game:engine/views/bullet-system');

import BulletView from './bullet';
import ObjectPool from '../object-pool';

class BulletSystemView {
    constructor (bulletSystem) {
        this.bulletSystem = bulletSystem;
        this.bulletViewPool = new ObjectPool(() => {
            return new BulletView(null);
        }, this.bulletSystem.poolSize, 10);

        this.bulletViewPairs = new WeakMap();
    }

    init () {
        this.mesh = new THREE.Object3D();
    }

    update (delta, sceneUpdates) {
        // Keep viewPool in sync with bullet pool
        if (this.bulletSystem.poolSize > this.bulletViewPool.size) {
            this.bulletViewPool.allocate(this.bulletSystem.poolSize - this.bulletViewPool.size);
        }

        // Clear previously killed bullets
        for (let deadBullet of this.bulletSystem.deadBullets) {
            this.bulletViewPairs.get(deadBullet).update(delta);

            this.bulletSystem.deadBullets.delete(deadBullet);
        }

        for (let bullet of this.bulletSystem.activeBullets) {
            let bulletView = this.bulletViewPairs.get(bullet);

            if (!bulletView) {
                bulletView = this.bulletViewPool.get();

                bulletView.bullet = bullet;
                bulletView.init();

                this.mesh.add(bulletView.mesh);

                this.bulletViewPairs.set(bullet, bulletView);
            }

            bulletView.update(delta);
        }
    }
}

export default BulletSystemView;
