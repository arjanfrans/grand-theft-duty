import Gamepad from '../../engine/input/Gamepad';
import {HumanInput} from '../../engine/input/HumanInput';
import MenuState from "./MenuState";
import {AllKeys, Keys} from "../../engine/input/Keys";
import {StateInput} from "../../engine/state/StateInput";
import {InputSourceInterface} from "../../engine/input/InputSourceInterface";

class MenuInput implements StateInput {
    private state: MenuState;
    private input: HumanInput;

    constructor (inputSources: Map<string, InputSourceInterface>, state: MenuState) {
        this.input = new HumanInput(inputSources);
        this.state = state;
    }

    update () {
        const state = this.state;
        const selectedItem = state.currentMenu.selectedItem;

        // Do not change selection while editing
        if (!selectedItem.isEditing) {
            if (this.input.keyboardDownOnce(Keys.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
                state.currentMenu.moveUp();
            } else if (this.input.keyboardDownOnce(Keys.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
                state.currentMenu.moveDown();
            }
        }

        if (selectedItem.editable && selectedItem.isEditing) {
            if (this.input.keyboardDownOnce(Keys.BACKSPACE)) {
                selectedItem.value = selectedItem.value.slice(0, -1);
            } else if (this.input.keyboard.lastPressedIsChar()) {
                if (this.input.keyboardDownOnce(AllKeys[this.input.keyboard.keyByCode(this.input.keyboard.lastPressed)])) {
                    selectedItem.value += this.input.keyboard.lastPressedChar();
                }
            }
        }

        if (this.input.keyboardDownOnce(Keys.ENTER) || this.input.keyboardDownOnce(Keys.SPACE) ||
                this.input.gamepadButtonDownOnce('actionSouth')) {
            state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
