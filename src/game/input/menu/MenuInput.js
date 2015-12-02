import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';

class MenuInput {
    constructor (state) {
        this.state = state;

        // TODO better previous keys system
        this.previousKeys = {};
    }

    update () {
        if ((!this.previousKeys.UP && Keyboard.isDown(Keyboard.UP)) || Gamepad.isStickDown(0, 'left', 'up')) {
            this.previousKeys.UP = true;
            this.state.currentMenu.moveUp();
        } else if ((!this.previousKeys.DOWN && Keyboard.isDown(Keyboard.DOWN)) || Gamepad.isStickDown(0, 'left', 'down')) {
            this.previousKeys.DOWN = true;
            this.state.currentMenu.moveDown();
        } else {
            if (this.previousKeys.UP && !Keyboard.isDown(Keyboard.UP)) {
                this.previousKeys.UP = false;
            } else if (this.previousKeys.DOWN && !Keyboard.isDown(Keyboard.DOWN)) {
                this.previousKeys.DOWN = false;
            }
        }

        if ((!this.previousKeys.ENTER && !this.previousKeys.SPACE) &&
            (Keyboard.isDown(Keyboard.SPACE) || Keyboard.isDown(Keyboard.ENTER))) {
            this.previousKeys.ENTER = true;
            this.previousKeys.SPACE = true;
            this.state.currentMenu.selectCurrentItem();
        } else if (this.previousKeys.ENTER && !Keyboard.isDown(Keyboard.ENTER)) {
            this.previousKeys.ENTER = false;
        } else if (this.previousKeys.SPACE && !Keyboard.isDown(Keyboard.SPACE)) {
            this.previousKeys.SPACE = false;
        }
    }
}

export default MenuInput;
