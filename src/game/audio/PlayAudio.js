let debug = require('debug')('game:game/audio/PlayAudio');

import AssetManager from '../../engine/AssetManager';

class PlayAudio {
    constructor (effectsSpriteName, backgroundSpriteName) {
        this.effectsSpriteName = effectsSpriteName;
        this.backgroundSpriteName = backgroundSpriteName;
        this.effects = null;
        this.backgrounds = null;

        this.entities = new Set();
        this._initialized = false;
    }

    init () {
        this.effects = AssetManager.getAudioSprite(this.effectsSpriteName).sound;
        this.backgrounds = AssetManager.getAudioSprite(this.backgroundSpriteName).sound;

        this._initialized = true;
    }

    addEntity (entity) {
        this.entities.add(entity);
    }

    stopBackground () {
        this.backgrounds.stop();
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
