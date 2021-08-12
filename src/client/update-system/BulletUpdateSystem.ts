import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";
import { PlayState } from "../play/PlayState";

export class BulletUpdateSystem implements SystemUpdateInterface {
    private state: PlayState;

    constructor(state: PlayState) {
        this.state = state;
    }

    update(delta: number): boolean {
        this.state.bulletSystem.update(delta);

        return true;
    }
}
