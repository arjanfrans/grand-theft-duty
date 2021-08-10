import { Object3D } from "three";
import { ObjectPool } from "../../../engine/ObjectPool";
import { View } from "../../../engine/graphics/View";
import BulletView from "./BulletView";
import { BulletSystem } from "../../../core/BulletSystem";
import { Bullet } from "../../../core/entities/Bullet";

export class BulletSystemView extends View {
    private bulletSystem: BulletSystem;
    private bulletViewPool: ObjectPool<BulletView>;
    private bulletViewPairs: WeakMap<Bullet, BulletView> = new WeakMap<
        Bullet,
        BulletView
    >();

    constructor(bulletSystem, poolLimit?: number) {
        super();

        this.bulletSystem = bulletSystem;
        this.bulletViewPool = new ObjectPool<BulletView>(
            (): BulletView => {
                return new BulletView(null);
            },
            this.bulletSystem.poolSize,
            10,
            poolLimit || 200
        );
    }

    init() {
        this.mesh = new Object3D();

        super.init();
    }

    update(delta) {
        // Keep viewPool in sync with bullet pool
        if (this.bulletSystem.poolSize > this.bulletViewPool.size) {
            this.bulletViewPool.allocate(
                this.bulletSystem.poolSize - this.bulletViewPool.size
            );
        }

        // Clear previously killed bullets
        for (const deadBullet of this.bulletSystem.deadBullets) {
            const bulletView = this.bulletViewPairs.get(deadBullet);

            if (bulletView) {
                bulletView.update(delta);
            }

            this.bulletSystem.deadBullets.delete(deadBullet);
        }

        for (const bullet of this.bulletSystem.activeBullets) {
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
