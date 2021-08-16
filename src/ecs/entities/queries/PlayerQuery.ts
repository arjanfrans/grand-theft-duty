import { EntityManager } from "../EntityManager";
import { Entity } from "../Entity";
import { PlayerControllableComponent } from "../../components/PlayerControllableComponent";
import { SoldierComponent } from "../../components/SoldierComponent";

export class PlayerQuery {
    private constructor() {}

    public static getPlayerEntity(em: EntityManager): Entity {
        const entities = em.getEntitiesWithTypes([
            PlayerControllableComponent.TYPE,
            SoldierComponent.TYPE,
        ]);

        if (entities.length !== 1) {
            throw new Error("No player entity found");
        }

        return entities[0];
    }
}
