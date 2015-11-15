let debug = require('debug')('game:engine/states/menu/MenuState');

import State from '../State';
import AssetManager from '../../AssetManager';

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
