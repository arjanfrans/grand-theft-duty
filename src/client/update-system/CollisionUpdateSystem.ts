import CollisionUtils from "../../core/CollisionUtils";
import { PlayState } from "../play/PlayState";
import { Soldier } from "../../core/entities/Soldier";
import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";

export class CollisionUpdateSystem implements SystemUpdateInterface {
    private readonly entities: Set<Soldier>;
    private readonly map: any;

    constructor(state: PlayState) {
        this.entities = state.soldiers;
        this.map = state.map;
    }

    update(delta: number): boolean {
        for (const entity of this.entities) {
            CollisionUtils.wallCollision(this.map, entity, (response) => {
                entity.position.x -= response.overlapV.x;
                entity.position.y -= response.overlapV.y;
            });

            CollisionUtils.floorCollision(this.map, entity, delta, (block) => {
                if (block.type === "water") {
                    entity.fall();
                    entity.kill();
                } else {
                    entity.position.z = block.position.z + block.depth;
                    entity.stopFalling();
                }
            });
        }

        return true;
    }
}
