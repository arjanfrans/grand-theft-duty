import { AbstractState } from "../AbstractState";
import { Soldier } from "../../core/entities/Soldier";
import { Player } from "../../core/entities/Player";
import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";
import { PauseUpdateSystem } from "../update-system/PauseUpdateSystem";
import { BulletSystem } from "../../core/BulletSystem";
import { MatchSystem } from "../../ecs/systems/MatchSystem";
import { Engine } from "../../engine/Engine";

/**
 * State of playing the game.
 */
export class PlayState extends AbstractState {
    public bulletSystem: BulletSystem;
    public player?: Player;
    public map: any;
    public match: any;
    public showScores: boolean = false;
    private pauseSystem?: PauseUpdateSystem;

    constructor(engine: Engine, match: MatchSystem, map: any) {
        super("play", engine);

        this.map = map;
        this.match = match;
        this.bulletSystem = new BulletSystem(this, 200);
    }

    init() {
        super.init();
    }

    get soldiers(): Set<Soldier> {
        return this.match.soldiers;
    }

    get paused(): boolean {
        const pauseSystem = this.pauseSystem;

        return pauseSystem ? pauseSystem.isPaused : false;
    }

    pause() {
        const pauseSystem = this.pauseSystem;

        if (pauseSystem) {
            pauseSystem.isPaused = true;
        }
    }

    resume() {
        const pauseSystem = this.pauseSystem;

        if (pauseSystem) {
            pauseSystem.isPaused = false;
        }
    }

    addSystem(system: SystemUpdateInterface, priority: number) {
        if (system instanceof PauseUpdateSystem) {
            this.pauseSystem = system;
        }

        super.addSystem(system, priority);
    }
}
