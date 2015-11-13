let debug = require('debug')('game:engine/states/menu/MenuState');

import State from '../state';

class MenuState extends State {

    constructor (menu) {
        super('menu');

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
