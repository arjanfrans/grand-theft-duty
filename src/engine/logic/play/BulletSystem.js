let debug = require('debug')('game:engine/logic/play/BulletSystem');

import ObjectPool from '../../utils/object-pool';
import Entities from './entities';

import SAT from '../../collision/SAT';
import CollisionResponse from '../../collision/Response';

class BulletSystem {
    constructor () {
        this.activeBullets = new Set();

        this.bulletPool = new ObjectPool(() => {
            let bullet = new Entities.Bullet(0, 0, 0, 2, 8);

            return bullet;
        }, 10, 10);

        this.entities = new Set();

        // Bullets that died last turn
        this.deadBullets = new Set();
    }

    get poolSize () {
        return this.bulletPool.size;
    }

    _fireBullet (firedBy) {
        let bullet = this.bulletPool.get();

        // If the pool is full, reused the first item.
        if (!bullet) {
            let firstBullet = this.activeBullets.values().next().value;

            this.bulletPool.free(firstBullet);

            bullet = this.bulletPool.get();
        }

        bullet.revive();
        bullet.firedBy = firedBy;
        bullet.position.x = firedBy.position.x;
        bullet.position.y = firedBy.position.y;
        bullet.position.z = firedBy.position.z;

        bullet.angle = firedBy.angle;

        this.activeBullets.add(bullet);

        return bullet;
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            if (entity.actions.firedBullet) {
                this._fireBullet(entity);
            }
        }

        for (let bullet of this.activeBullets) {
            bullet.update(delta);

            if (bullet.dead) {
                this.deadBullets.add(bullet);
                this.activeBullets.delete(bullet);
                this.bulletPool.free(bullet);
            } else {
                for (let entity of this.entities) {
                    if (!entity.dead) {
                        // Can't kill itself
                        if (bullet.firedBy !== entity) {
                            // Check if on same level
                            if ((bullet.position.z >= entity.position.z) && (bullet.position.z < entity.position.z + 50)) {
                                let response = new CollisionResponse();

                                if (SAT.testPolygonPolygon(entity.body, bullet.body, response)) {
                                    entity.hitByBullet();
                                    bullet.kill();
                                    this.bulletPool.free(bullet);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default BulletSystem;
