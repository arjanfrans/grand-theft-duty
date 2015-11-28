import ObjectPool from './utils/ObjectPool';
import Bullet from './entities/Bullet';

import SAT from './collision/SAT';
import CollisionResponse from './collision/Response';
import CollisionSystem from './collision/CollisionSystem';

class BulletSystem extends CollisionSystem {
    constructor (map) {
        super(map, {
            wallCollision: true,
            floorCollision: false,
            onWallCollision: function (bullet) {
                bullet.kill();
                this.addEntity(bullet);
            }
        });

        this.activeBullets = new Set();

        this.bulletPool = new ObjectPool(() => {
            let bullet = new Bullet(0, 0, 0, 2, 8);

            this.addEntity(bullet);

            return bullet;
        }, 10, 10);

        this.characters = new Set();
        this.soldiers = new Set();

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

        bullet.firedBy = firedBy;
        bullet.firedByWeapon = firedBy.currentWeapon;
        bullet.respawn(firedBy.position);
        bullet.angle = firedBy.angle;

        this.activeBullets.add(bullet);

        return bullet;
    }

    addCharacter (character) {
        if (character.options.isSoldier) {
            this.soldiers.add(character);
        }

        this.characters.add(character);
    }

    removeCharacter (character) {
        if (character.options.isSoldier) {
            this.soldiers.delete(character);
        }

        this.characters.delete(character);
    }

    killBullet (bullet) {
        bullet.kill();
        this.bulletPool.free(bullet());
    }

    update (delta) {
        for (let soldier of this.soldiers) {
            if (soldier.actions.firedBullet) {
                this._fireBullet(soldier);
            }
        }

        super.update(delta);
        for (let bullet of this.activeBullets) {
            bullet.update(delta);

            if (bullet.dead) {
                this.deadBullets.add(bullet);
                this.activeBullets.delete(bullet);
                this.bulletPool.free(bullet);
            } else {
                for (let character of this.characters) {
                    if (!character.dead) {
                        // Can't kill itself
                        if (bullet.firedBy !== character) {
                            // Check if on same level
                            if ((bullet.position.z >= character.position.z) && (bullet.position.z < character.position.z + 50)) {
                                let response = new CollisionResponse();

                                // TODO point - polygon test might be nicer for bullets
                                if (SAT.testPolygonPolygon(character.body, bullet.body, response)) {
                                    character.hitByBullet(bullet);
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
