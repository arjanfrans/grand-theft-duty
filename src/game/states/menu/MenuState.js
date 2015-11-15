let debug = require('debug')('game:engine/states/menu/MenuState');

import State from '../../../engine/states/State';
import AssetManager from '../../../engine/AssetManager';

class MenuState extends State {

    constructor (engine, menu) {
        super('menu', engine);

        this.menu = menu;
    }

    init () {
        super.init();

        // FIXME move this out of here
        AssetManager.getAudioSprite('background').sound.play('russia');
    }

    update (delta) {
        super.updateInputs();

        super.updateView(delta);
    }
}

export default MenuState;
