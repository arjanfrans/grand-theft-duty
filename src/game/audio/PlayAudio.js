let debug = require('debug')('game:game/audio/PlayAudio');

import StateAudio from '../../engine/audio/StateAudio';

class PlayAudio extends StateAudio {
    constructor (state, effectsSpriteName, backgroundSpriteName) {
        super(state, effectsSpriteName, backgroundSpriteName);
        this.entities = new Set();
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    update (delta) {
        for (let entity of this.entities) {
            if (entity.actions.firedBullet) {
                // TODO get gun name
                this.effects.play('mp44');
            }
        }
    }
}

export default PlayAudio;
