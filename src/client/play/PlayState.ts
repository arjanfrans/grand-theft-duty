import { State } from "../State";
import { Soldier } from "../../core/entities/Soldier";
import CollisionSystem from "../../core/CollisionSystem";
import { BulletSystem } from "../../core/BulletSystem";
import { Player } from "../../core/entities/Player";

/**
 * State of playing the game.
 */
export class PlayState extends State {
    private collisionSystem?: CollisionSystem;
    private bulletSystem?: BulletSystem;
    public player?: Player;
    public map: any;
    public match: any;
    public showScores: boolean = false;
    public paused: boolean = false;
    private onPause?: () => any;

    constructor(engine, match, map) {
        super("play", engine);

        this.map = map;
        this.match = match;
    }

    init() {
        super.init();
    }

    get soldiers(): Set<Soldier> {
        return this.match.soldiers;
    }

    pause() {
        if (this.onPause) {
            this.onPause();
        }

        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update(delta) {
        super.updateInputs(delta);

        if (this.paused) {
            return;
        }

        super.updateAudio(delta);

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        for (const soldier of this.soldiers) {
            soldier.update(delta);

            if (soldier.dead) {
                const position = this.map.randomRespawnPosition();

                soldier.respawn(position);
            }
        }

        this.match.update(delta);

        if (this.collisionSystem) {
            this.collisionSystem.update(delta);
        }
    }
}
