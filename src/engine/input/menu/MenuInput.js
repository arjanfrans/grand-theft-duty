let debug = require('debug')('game:engine/input/menu/MenuInput');

import Keyboard from '../utils/Keyboard';
import Gamepad from '../utils/Gamepad';

class MenuInput {
    constructor (menu) {
        this.menu = menu;
    }

    update () {
        if (Keyboard.isDown(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
            this.menu.moveUp();
        } else if (Keyboard.isDown(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
            this.menu.moveDown();
        }

        if (Keyboard.isDown(Keyboard.SPACE) || Keyboard.isDown(Keyboard.ENTER)) {
            this.menu.selectCurrentItem();
        }
    }
}

export default MenuInput;
