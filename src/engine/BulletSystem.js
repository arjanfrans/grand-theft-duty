import ObjectPool from './utils/ObjectPool';
import Bullet from './entities/Bullet';

import SAT from './collision/SAT';
import CollisionResponse from './collision/Response';

class BulletSystem {
    constructor (map, options = {}) {
        this.map = map;
        this.activeBullets = new Set();

        this.rayDistance = (map.tileWidth + map.tileHeight) / 2;
        this.onWallCollision = options.onWallCollision || function () {};

        this.bulletPool = new ObjectPool(() => {
            let bullet = new Bullet(0, 0, 0, 4, 10);

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

    _wallCollision (entity, nextPosition, blocks) {
        for (let block of blocks) {
            if (block.collidable) {
                let polygons = block.bodies;

                for (let polygon of polygons) {
                    let response = new CollisionResponse();

                    if (SAT.testPolygonPolygon(entity.body, polygon, response)) {
                        entity.kill();
                    }
                }
            }
        }
    }

    _collision (entity, delta) {
        let nextEntityPosition = {
            x: entity.position.x + (entity.velocity.x * delta),
            y: entity.position.y + (entity.velocity.y * delta),
            z: entity.position.z + (entity.velocity.z * delta)
        };

        let ray = this._rayPositions(entity);

        if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
            let blocks = this.map.blocksBetweenPositions(ray.min, ray.max, ['wall']);

            this._wallCollision(entity, nextEntityPosition, blocks);
        }
    }

    update (delta) {
        for (let soldier of this.soldiers) {
            if (soldier.actions.firedBullet) {
                this._fireBullet(soldier);
            }
        }

        for (let bullet of this.activeBullets) {
            bullet.update(delta);

            this._collision(bullet, delta);

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
                                if (SAT.pointInPolygon(bullet.point, character.body, response)) {
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

    _rayPositions (entity) {
        let x = entity.position.x;
        let y = entity.position.y;
        let angle = entity.angle;

        let reverse = entity.reverse ? -1 : 1;

        let start = {};
        let end = {};

        if (Math.abs(entity.velocity.x) > 0) {
            x -= this.rayDistance * Math.cos(angle) * reverse;
        } else {
            x -= this.rayDistance * reverse;
        }

        if (entity.velocity.x < 0) {
            start.x = x;
            end.x = entity.position.x;
        } else {
            start.x = entity.position.x;
            end.x = x;
        }

        if (Math.abs(entity.velocity.y) > 0) {
            y -= this.rayDistance * Math.sin(angle) * reverse;
        } else {
            y -= this.rayDistance * reverse;
        }

        if (entity.velocity.y < 0) {
            start.y = y;
            end.y = entity.position.y;
        } else {
            start.y = entity.position.y;
            end.y = y;
        }

        start.z = entity.position.z;
        end.z = entity.position.z;

        return { min: start, max: end };
    }

};

export default BulletSystem;
