let debug = require('debug')('game:engine/physics');

let SAT = require('./sat/SAT');
let CollisionResponse = require('./sat/Response');

const GRAVITY = 50;

let _calculateRayPositions = function (entity) {
    let rayDistance = 100;

    let x = entity.position.x;
    let y = entity.position.y;
    let angle = entity.angle;

    let reverse = entity.reverse ? -1 : 1;

    let start = {};
    let end = {};

    if (Math.abs(entity.velocity.x) > 0) {
        x -= rayDistance * Math.cos(angle) * reverse;
    } else {
        x -= rayDistance * reverse;
    }

    if (entity.velocity.x < 0) {
        start.x = x;
        end.x = entity.position.x;
    } else {
        start.x = entity.position.x;
        end.x = x;
    }

    if (Math.abs(entity.velocity.y) > 0) {
        y -= rayDistance * Math.sin(angle) * reverse;
        start.y = y;
        end.y = entity.position.y;
    } else {
        y -= rayDistance * reverse;
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

    // No 3d dimension for now
    start.z = entity.position.z;
    end.z = entity.position.z;

    return { min: start, max: end };
};

let _detectWalls = function (entity, nextPosition, blocks) {
    for (let block of blocks) {
        let polygons = block.wallPolygons;

        for (let polygon of polygons) {
            let response = new CollisionResponse();

            if (SAT.testPolygonPolygon(entity.polygon, polygon, response)) {
                // console.log('collision', response);
                //
                // if (Math.abs(response.overlapV.x) > 0) {
                //     entity.velocity.x = 0;
                // }
                //
                // if (Math.abs(response.overlapV.y) > 0) {
                //     entity.velocity.y = 0;
                // }
                //
                //
                //
                // console.log(response)
                entity.position.x -= response.overlapV.x;
                entity.position.y -= response.overlapV.y;
            }
        }
    }
};

let _detectFloorCollision = function (entity, nextEntityPosition, block) {
    if (entity.position.z <= 0) {
        entity.stopFalling();
        entity.position.z = 0;

        return true;
    }

    if (block) {
        if (nextEntityPosition.z <= block.position.z + block.depth) {
            entity.position.z = block.position.z + block.depth;
            entity.stopFalling();
        }
    } else {
        entity.fall();
    }
};

class Physics {
    constructor () {
        this.entities = new Set();
        this.map = null;
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            let ray = _calculateRayPositions(entity);

            let nextEntityPosition = {
                x: entity.position.x + (entity.velocity.x * delta),
                y: entity.position.y + (entity.velocity.y * delta),
                z: entity.position.z + (entity.velocity.z * delta)
            };

            if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
                let blocks = this.map.blocksBetweenPositions(ray.min, ray.max);

                // let blocks = this.map.blocksBetweenPositions({ x: 0, y: 0, z: 0}, { x: 900, y: 900, z: 0 } );

                _detectWalls(entity, nextEntityPosition, blocks);
            }

            let floorBlockIndex = this.map.positionToIndex(entity.position);

            floorBlockIndex.z -= 1;

            let block = this.map.blockAtIndex(floorBlockIndex);

            _detectFloorCollision(entity, nextEntityPosition, block);
        }
    }
}

module.exports = Physics;
