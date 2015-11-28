let debug = require('debug')('game:game/audio/MenuAudio');

import StateAudio from '../../engine/audio/StateAudio';

class MenuAudio extends StateAudio {
    constructor (menuState, effectsSpriteName, backgroundSpriteName) {
        super(menuState, effectsSpriteName, backgroundSpriteName);

        this.menu = menuState.menu;
        this.selectedItem = this.menu.selectedItem;
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
