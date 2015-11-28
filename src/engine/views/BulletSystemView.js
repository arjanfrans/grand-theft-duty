import ObjectPool from '..//utils/ObjectPool';
import View from './View';

class BulletSystemView extends View {
    constructor (bulletSystem, BulletView) {
        super();
        this.BulletView = BulletView;

        this.bulletSystem = bulletSystem;
        this.bulletViewPool = new ObjectPool(() => {
            return new this.BulletView(null);
        }, this.bulletSystem.poolSize, 10);

        this.bulletViewPairs = new Map();
    }

    init () {
        this.mesh = new THREE.Object3D();
        this._initialized = true;
    }

    update (delta) {
        // Keep viewPool in sync with bullet pool
        if (this.bulletSystem.poolSize > this.bulletViewPool.size) {
            this.bulletViewPool.allocate(this.bulletSystem.poolSize - this.bulletViewPool.size);
        }

        // Clear previously killed bullets
        for (let deadBullet of this.bulletSystem.deadBullets) {
            let bulletView = this.bulletViewPairs.get(deadBullet);

            if (bulletView) {
                bulletView.update(delta);
            }

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
