import {PositionComponent} from "../ecs/components/PositionComponent";
import {MovementComponent} from "../ecs/components/MovementComponent";
import {Polygon} from "../engine/math/Polygon";
import {SatResult} from "../engine/physics/SatResult";
import {SeparatingAxisTheorem} from "../engine/physics/SeparatingAxisTheorem";

const rayPositions = function (position: PositionComponent, movement: MovementComponent, rayDistance: number) {
    let x = position.position.x;
    let y = position.position.y;
    const angle = movement.angle;

    const reverse = movement.reverse ? -1 : 1;

    const start = {x: 0, y: 0, z: 0};
    const end = {x: 0, y: 0, z: 0};

    if (Math.abs(movement.velocity.x) > 0) {
        x -= rayDistance * Math.cos(angle) * reverse;
    } else {
        x -= rayDistance * reverse;
    }

    if (movement.velocity.x < 0) {
        start.x = x;
        end.x = position.position.x;
    } else {
        start.x = position.position.x;
        end.x = x;
    }

    if (Math.abs(movement.velocity.y) > 0) {
        y -= rayDistance * Math.sin(angle) * reverse;
    } else {
        y -= rayDistance * reverse;
    }

    if (movement.velocity.y < 0) {
        start.y = y;
        end.y = position.position.y;
    } else {
        start.y = position.position.y;
        end.y = y;
    }

    start.z = position.position.z;
    end.z = position.position.z;

    return { min: start, max: end };
};

const cachedSatResult = new SatResult();


export class CollisionChecker {
    public static sat: SeparatingAxisTheorem = new SeparatingAxisTheorem();

    private constructor() {
    }

    public static wallCollision (map, position: PositionComponent, movement: MovementComponent, body: Polygon, onCollision) {
        const rayDistance = (map.blockWidth + map.blockHeight) / 2;
        const ray = rayPositions(position, movement, rayDistance);

        if (!(ray.min.x === ray.max.x && ray.min.y === ray.max.y)) {
            const blocks = map.blocksBetweenPositions(ray.min, ray.max, ['wall']);

            for (const block of blocks) {
                if (block.collidable) {
                    const polygons = block.bodies;

                    for (const polygon of polygons) {
                        cachedSatResult.clear();

                        if (CollisionChecker.sat.testPolygonInPolygon(body, polygon, cachedSatResult)) {
                            onCollision(cachedSatResult);
                        }
                    }
                }
            }
        }
    }

    public static floorCollision (map, position: PositionComponent, movement: MovementComponent, body: Polygon, delta: number, onCollision) {
        const nextEntityPosition = {
            x: position.position.x + (movement.velocity.x * delta),
            y: position.position.y + (movement.velocity.y * delta),
            z: position.position.z + (movement.velocity.z * delta)
        };

        const floorBlockIndex = map.positionToIndex(position.position);

        floorBlockIndex.z -= 1;

        const block = map.blockAtIndex(floorBlockIndex);

        if (block && block.collidable && block.walls.top) {
            if (nextEntityPosition.z <= block.position.z + block.depth) {
                onCollision(block);
            }
        } else {
            movement.fall();
        }
    }
}
