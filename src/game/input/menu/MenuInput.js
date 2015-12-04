import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';
import HumanInput from '../../../engine/input/HumanInput';

class MenuInput extends HumanInput {
    constructor (state) {
        super();

        this.state = state;
    }

    update () {
        if (this.keyboardDownOnce(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
            this.state.currentMenu.moveUp();
        } else if (this.keyboardDownOnce(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
            this.state.currentMenu.moveDown();
        }

        if (this.keyboardDownOnce(Keyboard.ENTER) || this.keyboardDownOnce(Keyboard.SPACE) ||
                this.gamepadButtonDownOnce('actionSouth')) {
            this.state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
