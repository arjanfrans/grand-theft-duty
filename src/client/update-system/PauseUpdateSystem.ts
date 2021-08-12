import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";

export class PauseUpdateSystem implements SystemUpdateInterface {
    public isPaused: boolean = false;

    update(delta: number): boolean {
        return !this.isPaused;
    }
}
