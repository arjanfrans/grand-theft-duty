import { Entity } from "../entities/Entity";
import { CollisionComponent } from "../components/CollisionComponent";
import { Polygon } from "../../engine/math/Polygon";
import { Vector2 } from "three";
import { DimensionComponent } from "../components/DimensionComponent";
import { PositionComponent } from "../components/PositionComponent";
import { MovementComponent } from "../components/MovementComponent";
import { AliveComponent } from "../components/AliveComponent";
import { SoldierComponent } from "../components/SoldierComponent";
import { CollisionChecker } from "../../collision/CollisionChecker";
import { EntityManager } from "../entities/EntityManager";
import { SystemInterface } from "./SystemInterface";

export class CollisionSystem implements SystemInterface {
    public static REQUIRED_COMPONENTS = [
        MovementComponent.TYPE,
        PositionComponent.TYPE,
        AliveComponent.TYPE,
        CollisionComponent.TYPE,
    ];
    private em: EntityManager;
    private readonly bodies: WeakMap<Entity, Polygon> = new WeakMap();
    private map: any;

    constructor(em: EntityManager, map: any) {
        this.em = em;
        this.map = map;
    }

    private getEntities(): Entity[] {
        const entities = this.em.getEntitiesWithTypes(
            CollisionSystem.REQUIRED_COMPONENTS
        );

        for (const entity of entities) {
            this.addBody(entity);
        }

        return entities;
    }

    private addBody(entity: Entity) {
        if (!this.bodies.has(entity)) {
            const dimensionComponent = entity.getComponent<DimensionComponent>(
                DimensionComponent.TYPE
            );
            const positionComponent = entity.getComponent<PositionComponent>(
                PositionComponent.TYPE
            );

            const halfWidth = dimensionComponent.halfWidth;
            const halfHeight = dimensionComponent.halfHeight;

            const body = new Polygon(
                new Vector2(
                    positionComponent?.position.x,
                    positionComponent?.position.y
                ),
                [
                    new Vector2(-halfWidth, -halfHeight),
                    new Vector2(-halfWidth, halfHeight),
                    new Vector2(halfWidth, halfHeight),
                    new Vector2(halfWidth, 0),
                ]
            );

            this.bodies.set(entity, body);
        }
    }

    update(delta: number): void {
        for (const entity of this.getEntities()) {
            const movement = entity.getComponent<MovementComponent>(
                MovementComponent.TYPE
            );
            const position = entity.getComponent<PositionComponent>(
                PositionComponent.TYPE
            );
            const alive = entity.getComponent<AliveComponent>(
                AliveComponent.TYPE
            );
            const soldier = entity.getComponent<SoldierComponent>(
                SoldierComponent.TYPE
            );
            const body = this.bodies.get(entity) as Polygon;

            if (!alive.isDead) {
                body.position.x = position.position.x;
                body.position.y = position.position.y;

                CollisionChecker.wallCollision(
                    this.map,
                    position,
                    movement,
                    body,
                    (response) => {
                        position.position.x -= response.overlapV.x;
                        position.position.y -= response.overlapV.y;
                    }
                );

                CollisionChecker.floorCollision(
                    this.map,
                    position,
                    movement,
                    body,
                    delta,
                    (block) => {
                        if (block.type === "water") {
                            movement.fall();

                            alive.isDead = true;
                            soldier.kill();
                        } else {
                            position.position.z =
                                block.position.z + block.depth;
                            movement.stopFalling();
                        }
                    }
                );
            }
        }
    }
}
