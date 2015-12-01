import StateAudio from '../../engine/audio/StateAudio';

class PlayAudio extends StateAudio {
    constructor (state, effectsSpriteName, backgroundSpriteName) {
        super(state, effectsSpriteName, backgroundSpriteName);
        this.entities = state.soldiers;
        this.player = state.player;
    }

    update (delta) {
        for (let entity of this.entities) {
            if (entity === this.player && entity.actions.firedBullet) {
                // TODO get gun name
                this.effects.play('mp44');
            }
        }
    }
}

export default PlayAudio;
