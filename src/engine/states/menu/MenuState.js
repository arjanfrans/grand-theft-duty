let debug = require('debug')('game:engine/states/menu/MenuState');

import State from '../State';

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

        super.updateView(delta);
    }
}

export default MenuState;
