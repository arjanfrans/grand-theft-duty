import {PositionComponent} from "../components/PositionComponent";
import {MovementComponent} from "../components/MovementComponent";
import {AliveComponent} from "../components/AliveComponent";
import {Entity} from "../Entity";
import {BulletComponent} from "../components/BulletComponent";
import {ObjectPool} from "../../engine/utils/ObjectPool";
import {BulletFactory} from "../../factory/BulletFactory";
import {EntityManager} from "../EntityManager";
import {SystemInterface} from "./SystemInterface";

export class BulletSystem implements SystemInterface {
    private em: EntityManager;
    public static REQUIRED_COMPONENTS = [
        MovementComponent.TYPE,
        PositionComponent.TYPE,
        AliveComponent.TYPE,
        BulletComponent.TYPE
    ];
    private bulletPool: ObjectPool<Entity>;

    constructor(em: EntityManager) {
        this.em = em;
        this.bulletPool = new ObjectPool<Entity>(
            (): Entity => {
                return BulletFactory.create(0, 0, 0);
            },
            10,
            10,
            200
        );
    }

    private getEntities(): Entity[]
    {
        return this.em.getEntitiesWithTypes(BulletSystem.REQUIRED_COMPONENTS)
    }


    update(delta: number): void {
        for (const entity of this.getEntities()) {
            const movement = entity.getComponent<MovementComponent>(MovementComponent.TYPE);
            const alive = entity.getComponent<AliveComponent>(AliveComponent.TYPE);
            const bullet = entity.getComponent<BulletComponent>(BulletComponent.TYPE);

            if (!alive.isDead) {
                bullet.traveledDistance += movement.speed * delta;

                if (bullet.traveledDistance > bullet.maxDistance) {
                    alive.isDead = true;
                    bullet.traveledDistance = 0;
                } else {
                    movement.moveUp();
                }
            }
        }
    }

    // private fireBullet(firedBy) {
    //     let bullet = this.bulletPool.get();
    //
    //     // If the pool is full, reused the first item.
    //     if (!bullet) {
    //         const firstBullet = this.activeBullets.values().next().value;
    //
    //         this.bulletPool.free(firstBullet);
    //         bullet = this.bulletPool.get();
    //     }
    //
    //     bullet.firedBy = firedBy;
    //     bullet.firedByWeapon = firedBy.currentWeapon;
    //     bullet.respawn(firedBy.position);
    //     bullet.angle = firedBy.angle;
    //     this.activeBullets.add(bullet);
    //
    //     return bullet;
    // }

}
