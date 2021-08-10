import { StateAudio } from "../StateAudio";
import { PlayState } from "./PlayState";

class PlayAudio extends StateAudio {
    private entities: any;
    private player: any;

    constructor(
        state: PlayState,
        effectsSpriteName: string,
        backgroundSpriteName: string
    ) {
        super(effectsSpriteName, backgroundSpriteName);

        this.entities = state.soldiers;
        this.player = state.player;
    }

    update(delta) {
        for (const entity of this.entities) {
            if (entity === this.player && entity.actions.firedBullet) {
                this.effects.play(entity.currentWeapon.name);
            }
        }
    }
}

export default PlayAudio;
