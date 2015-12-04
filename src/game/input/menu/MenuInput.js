import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';
import Input from '../../../engine/input/Input';

class MenuInput extends Input {
    constructor (state) {
        super();

        this.state = state;

        // TODO better previous keys system
        this.previousKeys = {};
    }

    update () {
        if (this.downOnce(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
            this.state.currentMenu.moveUp();
        } else if (this.downOnce(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
            this.state.currentMenu.moveDown();
        }

        if (this.downOnce(Keyboard.ENTER) || this.downOnce(Keyboard.SPACE)) {
            this.state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
