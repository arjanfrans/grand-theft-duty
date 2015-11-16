let debug = require('debug')('game:game/audio/MenuAudio');

import AssetManager from '../../engine/AssetManager';

class MenuAudio {
    constructor (menu, effectsSpriteName, backgroundSpriteName) {
        this.menu = menu;
        this.effectsSpriteName = effectsSpriteName;
        this.backgroundSpriteName = backgroundSpriteName;
        this.effects = null;
        this.backgrounds = null;
        this.selectedItem = null;

        this._initialized = false;
    }

    init () {
        this.effects = AssetManager.getAudioSprite(this.effectsSpriteName).sound;
        this.backgrounds = AssetManager.getAudioSprite(this.backgroundSpriteName).sound;

        this.selectedItem = this.menu.selectedItem;

        this._initialized = true;
    }

    stopBackground () {
        this.backgrounds.stop();
    }

    update (delta) {
        // Selected item changed
        if (this.selectedItem !== this.menu.selectedItem) {
            this.selectedItem = this.menu.selectedItem;
            this.effects.play('select');
        }
    }
}

export default MenuAudio;
