import { Entity } from "../ecs/entities/Entity";
import { MovementComponent } from "../ecs/components/MovementComponent";
import { PositionComponent } from "../ecs/components/PositionComponent";
import { AliveComponent } from "../ecs/components/AliveComponent";
import { DimensionComponent } from "../ecs/components/DimensionComponent";

export class BulletFactory {
    private constructor() {}

    public static create(x: number, y: number, z: number): Entity {
        const components = [
            new DimensionComponent(4, 10, 0),
            new AliveComponent(true),
            new MovementComponent(),
            new PositionComponent(x, y, z),
        ];

        return new Entity(components);
    }
}
