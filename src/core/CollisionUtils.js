import SAT from '../engine/collision/SAT';
import Response from '../engine/collision/Response';

const rayPositions = function (entity, rayDistance) {
    let x = entity.position.x;
    let y = entity.position.y;
    const angle = entity.angle;

    const reverse = entity.reverse ? -1 : 1;

    const start = {};
    const end = {};

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

const CollisionUtils = {
    wallCollision (map, entity, onCollision) {
        const rayDistance = (map.blockWidth + map.blockHeight) / 2;
        const ray = rayPositions(entity, rayDistance);

        if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
            const blocks = map.blocksBetweenPositions(ray.min, ray.max, ['wall']);

            for (const block of blocks) {
                if (block.collidable) {
                    const polygons = block.bodies;

                    for (const polygon of polygons) {
                        const response = new Response();

                        if (SAT.testPolygonPolygon(entity.body, polygon, response)) {
                            onCollision(response);
                        }
                    }
                }
            }
        }
    },

    floorCollision (map, entity, delta, onCollision = () => {}) {
        const nextEntityPosition = {
            x: entity.position.x + (entity.velocity.x * delta),
            y: entity.position.y + (entity.velocity.y * delta),
            z: entity.position.z + (entity.velocity.z * delta)
        };

        const floorBlockIndex = map.positionToIndex(entity.position);

        floorBlockIndex.z -= 1;

        const block = map.blockAtIndex(floorBlockIndex);

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
