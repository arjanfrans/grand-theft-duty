import SAT from './SAT';
import Response from './Response';

let rayPositions = function (entity, rayDistance) {
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
    } else {
        y -= rayDistance * reverse;
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
};

let CollisionUtils = {
    wallCollision (map, entity, onCollision) {
        let rayDistance = (map.blockWidth + map.blockHeight) / 2;
        let ray = rayPositions(entity, rayDistance);

        if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
            let blocks = map.blocksBetweenPositions(ray.min, ray.max, ['wall']);

            for (let block of blocks) {
                if (block.collidable) {
                    let polygons = block.bodies;

                    for (let polygon of polygons) {
                        let response = new Response();

                        if (SAT.testPolygonPolygon(entity.body, polygon, response)) {
                            onCollision(response);
                        }
                    }
                }
            }
        }
    },

    floorCollision (map, entity, delta, onCollision = () => {}) {
        let nextEntityPosition = {
            x: entity.position.x + (entity.velocity.x * delta),
            y: entity.position.y + (entity.velocity.y * delta),
            z: entity.position.z + (entity.velocity.z * delta)
        };

        let floorBlockIndex = map.positionToIndex(entity.position);

        floorBlockIndex.z -= 1;

        let block = map.blockAtIndex(floorBlockIndex);

        if (block && block.collidable && block.walls.top) {
            if (nextEntityPosition.z <= block.position.z + block.depth) {
                onCollision(block);
            }
        } else {
            entity.fall();
        }
    }
};

export default CollisionUtils;
