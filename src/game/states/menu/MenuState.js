let debug = require('debug')('game:engine/states/menu/MenuState');

import State from '../../../engine/states/State';

class MenuState extends State {

    constructor (engine, menu) {
        super('menu', engine);

        this.menu = menu;
    }

    init () {
        super.init();
    }

    update (delta) {
        super.updateInputs();

        super.updateAudio();
    }
}

export default MenuState;
