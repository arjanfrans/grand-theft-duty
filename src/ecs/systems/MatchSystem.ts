import { EntityManager } from "../entities/EntityManager";
import { SoldierComponent } from "../components/SoldierComponent";
import { SystemInterface } from "./SystemInterface";

export class MatchSystem implements SystemInterface {
    private matchTime: number = 0;
    private matchDuration: number = 300000;
    public readonly soldiers: Set<SoldierComponent> =
        new Set<SoldierComponent>();
    private em: EntityManager;

    constructor(em: EntityManager) {
        this.em = em;
    }

    update(delta): void {
        this.matchTime += delta;

        if (this.matchTime >= this.matchDuration) {
            // TODO change state to menu
        }
    }
}
