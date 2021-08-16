import { Entity } from "../entities/Entity";
import { WeaponComponent } from "../components/WeaponComponent";
import { AliveComponent } from "../components/AliveComponent";
import { EntityManager } from "../entities/EntityManager";
import { SystemInterface } from "./SystemInterface";

export class WeaponSystem implements SystemInterface {
    private em: EntityManager;
    public static REQUIRED_COMPONENTS = [
        AliveComponent.TYPE,
        WeaponComponent.TYPE,
    ];

    constructor(em: EntityManager) {
        this.em = em;
    }

    private getEntities(): Entity[] {
        return this.em.getEntitiesWithTypes(WeaponSystem.REQUIRED_COMPONENTS);
    }

    update(delta: number): void {
        for (const entity of this.getEntities()) {
            const weapon = entity.getComponent<WeaponComponent>(
                WeaponComponent.TYPE
            );
            const alive = entity.getComponent<AliveComponent>(
                AliveComponent.TYPE
            );

            if (!alive.isDead) {
                if (weapon.currentWeapon) {
                    if (weapon.currentWeapon.magazine === 0) {
                        weapon.reload();
                    }
                }

                if (weapon.firedBullet) {
                    weapon.firedBullet = false;
                }

                if (weapon.currentWeapon) {
                    weapon.currentWeapon.update(delta);
                }
            }
        }
    }
}
