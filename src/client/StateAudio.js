import AssetManager from '../engine/AssetManager';

class StateAudio {
    constructor (state, effectsSpriteName = null, backgroundSpriteName = null) {
        this.state = state;
        this.effectsSpriteName = effectsSpriteName;
        this.backgroundSpriteName = backgroundSpriteName;

        this.effects = null;
        this.backgrounds = null;

        this._initialized = false;
    }

    init () {
        if (this.effectsSpriteName) {
            this.effects = AssetManager.getAudioSprite(this.effectsSpriteName).sound;
        }

        if (this.backgroundSpriteName) {
            this.backgrounds = AssetManager.getAudioSprite(this.backgroundSpriteName).sound;
        }

        this._initialized = true;
    }

    stopEffects () {
        if (this.effects) {
            this.effects.stop();
        }
    }

    stopBackground () {
        if (this.backgrounds) {
            this.backgrounds.stop();
        }
    }
}

export default StateAudio;
