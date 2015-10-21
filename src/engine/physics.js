let debug = require('debug')('game:engine/physics');

let _calculateRayPositions = function (entity) {
    let rayDistance = 101;

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
let inBlock = false;

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

            if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
                let blocks = this.map.blocksBetweenPositions(ray.min, ray.max);

                let playerBlock = this.map.blockAtPosition(entity.position);

                if (playerBlock) {
                    if (!inBlock) {
                        inBlock = true;
                        console.log(inBlock);
                    }
                } else {
                    if (inBlock) {
                        inBlock = false;
                        console.log(inBlock);
                    }
                }

                if (blocks.length > 0) {
                    debug('collision candidates', blocks.length);
                }
            }
        }
    }
}

module.exports = Physics;
