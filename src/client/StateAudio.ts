import AssetManager from "../engine/AssetManager";

export abstract class StateAudio {
    protected effectsSpriteName?: string;
    protected backgroundSpriteName?: string;
    protected effects?: any;
    protected backgrounds?: any;

    protected constructor(
        effectsSpriteName?: string,
        backgroundSpriteName?: string
    ) {
        this.effectsSpriteName = effectsSpriteName;
        this.backgroundSpriteName = backgroundSpriteName;

        this.effects = null;
        this.backgrounds = null;

        if (this.effectsSpriteName) {
            this.effects = AssetManager.getAudioSprite(
                this.effectsSpriteName
            ).sound;
        }

        if (this.backgroundSpriteName) {
            this.backgrounds = AssetManager.getAudioSprite(
                this.backgroundSpriteName
            ).sound;
        }
    }

    public abstract update(delta: number): void;

    stopEffects() {
        if (this.effects) {
            this.effects.stop();
        }
    }

    stopBackground() {
        if (this.backgrounds) {
            this.backgrounds.stop();
        }
    }
}
