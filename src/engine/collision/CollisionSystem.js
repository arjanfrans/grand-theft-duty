import SAT from './SAT';
import Response from './Response';

class CollisionSystem {
    constructor (map, options) {
        this.entities = new Set();
        this.map = map;
        this.rayDistance = (map.tileWidth + map.tileHeight) / 2;
        this.enableWallCollision = options.wallCollision || false;
        this.enableFloorCollision = options.floorCollision || false;
        this.onWallCollision = options.onWallCollision || function () {};
        this.onFloorCollision = options.onFloorCollision || function () {};
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            let nextEntityPosition = {
                x: entity.position.x + (entity.velocity.x * delta),
                y: entity.position.y + (entity.velocity.y * delta),
                z: entity.position.z + (entity.velocity.z * delta)
            };

            if (this.enableWallCollision) {
                let ray = this._rayPositions(entity);

                if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
                    let blocks = this.map.blocksBetweenPositions(ray.min, ray.max, ['wall']);

                    this._wallCollision(entity, nextEntityPosition, blocks);
                }
            }

            if (this.enableFloorCollision) {
                this._floorCollision(entity, nextEntityPosition);
            }
        }
    }

    _wallCollision (entity, nextPosition, blocks) {
        for (let block of blocks) {
            if (block.collidable) {
                let polygons = block.bodies;

                for (let polygon of polygons) {
                    let response = new Response();

                    if (SAT.testPolygonPolygon(entity.body, polygon, response)) {
                        entity.position.x -= response.overlapV.x;
                        entity.position.y -= response.overlapV.y;

                        this.onWallCollision(entity, block);
                    }
                }
            }
        }
    }

    _floorCollision (entity, nextEntityPosition) {
        let floorBlockIndex = this.map.positionToIndex(entity.position);

        floorBlockIndex.z -= 1;

        let block = this.map.blockAtIndex(floorBlockIndex);

        if (block && block.collidable && block.walls.top) {
            if (nextEntityPosition.z <= block.position.z + block.depth) {
                if (block.type === 'water') {
                    entity.fall();
                    entity.kill();
                } else {
                    entity.position.z = block.position.z + block.depth;
                    entity.stopFalling();
                }

                this.onFloorCollision(entity, block);
            }
        } else {
            entity.fall();
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
            start.y = y;
            end.y = entity.position.y;
        } else {
            y -= this.rayDistance * reverse;
            start.y = entity.position.y;
            end.y = y;
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
}

export default CollisionSystem;
