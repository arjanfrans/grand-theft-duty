import Keyboard from '../../engine/input/Keyboard';
import Gamepad from '../../engine/input/Gamepad';
import HumanInput from '../../engine/input/HumanInput';

class MenuInput extends HumanInput {
    constructor (state) {
        super();

        this.state = state;
    }

    update () {
        let state = this.state;
        let selectedItem = state.currentMenu.selectedItem;

        // Do not change selection while editing
        if (!selectedItem.isEditing) {
            if (this.keyboardDownOnce(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
                state.currentMenu.moveUp();
            } else if (this.keyboardDownOnce(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
                state.currentMenu.moveDown();
            }
        }

        if (selectedItem.editable && selectedItem.isEditing) {
            if (this.keyboardDownOnce(Keyboard.BACKSPACE)) {
                selectedItem.value = selectedItem.value.slice(0, -1);
            } else if (Keyboard.lastPressedIsChar()) {
                if (this.keyboardDownOnce(Keyboard[Keyboard.keyByCode(Keyboard.lastPressed)])) {
                    selectedItem.value = selectedItem.value + Keyboard.lastPressedChar();
                }
            }
        }

        if (this.keyboardDownOnce(Keyboard.ENTER) || this.keyboardDownOnce(Keyboard.SPACE) ||
                this.gamepadButtonDownOnce('actionSouth')) {
            state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
