import { Entity } from "../Entity";
import { PositionComponent } from "../components/PositionComponent";
import { MovementComponent } from "../components/MovementComponent";
import { AliveComponent } from "../components/AliveComponent";
import {EntityManager} from "../EntityManager";
import {SystemInterface} from "./SystemInterface";

export class MovementSystem implements SystemInterface {
    public static REQUIRED_COMPONENTS = [
        MovementComponent.TYPE,
        PositionComponent.TYPE,
        AliveComponent.TYPE,
    ];
    private em: EntityManager;

    constructor(em: EntityManager) {
        this.em = em;
    }

    private getEntities(): Entity[]
    {
        return this.em.getEntitiesWithTypes(MovementSystem.REQUIRED_COMPONENTS);
    }

    update(delta: number): void {
        for (const entity of this.getEntities()) {
            const movement = entity.getComponent<MovementComponent>(MovementComponent.TYPE);
            const position = entity.getComponent<PositionComponent>(PositionComponent.TYPE);
            const alive = entity.getComponent<AliveComponent>(AliveComponent.TYPE);

            if (!alive.isDead) {
                movement.angle += movement.angularVelocity * delta;

                if (movement.angle < 0) {
                    movement.angle = Math.PI * 2 - movement.angle;
                }

                position.previousPosition.x = position.position.x;
                position.previousPosition.y = position.position.y;
                position.previousPosition.z = position.position.z;

                position.position.x += movement.velocity.x * delta;
                position.position.y += movement.velocity.y * delta;
                position.position.z += movement.velocity.z * delta;
            }
        }
    }
}
