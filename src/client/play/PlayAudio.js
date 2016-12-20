import StateAudio from '../StateAudio';

class PlayAudio extends StateAudio {
    constructor (state, effectsSpriteName, backgroundSpriteName) {
        super(state, effectsSpriteName, backgroundSpriteName);
        this.entities = state.soldiers;
        this.player = state.player;
    }

    update (delta) {
        for (const entity of this.entities) {
            if (entity === this.player && entity.actions.firedBullet) {
                this.effects.play(entity.currentWeapon.name);
            }
        }
    }
}

export default PlayAudio;
