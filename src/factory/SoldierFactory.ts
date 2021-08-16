import { Entity } from "../ecs/entities/Entity";
import { AliveComponent } from "../ecs/components/AliveComponent";
import { CollisionComponent } from "../ecs/components/CollisionComponent";
import { MovementComponent } from "../ecs/components/MovementComponent";
import { DimensionComponent } from "../ecs/components/DimensionComponent";
import { PositionComponent } from "../ecs/components/PositionComponent";
import { WalkingComponent } from "../ecs/components/WalkingComponent";
import { SoldierComponent } from "../ecs/components/SoldierComponent";
import { WeaponComponent } from "../ecs/components/WeaponComponent";
import WeaponFactory from "../core/weapons/WeaponFactory";
import { ComputerControllableComponent } from "../ecs/components/ComputerControllableComponent";
import { Vector3 } from "three";

export class SoldierFactory {
    private constructor() {}

    public static create(
        name: string,
        team: string,
        position: Vector3
    ): Entity {
        return new Entity([
            new AliveComponent(),
            new CollisionComponent(),
            new MovementComponent(),
            new DimensionComponent(48, 48, 1),
            new PositionComponent(position.x, position.y, position.z),
            new WalkingComponent(),
            new SoldierComponent(name, team),
            new ComputerControllableComponent(),
            new WeaponComponent([
                WeaponFactory.mp44(),
                WeaponFactory.thompson(),
            ]),
        ]);
    }
}
