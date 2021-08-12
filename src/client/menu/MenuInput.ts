import Gamepad from "../../engine/input/Gamepad";
import { MenuState } from "./MenuState";
import { AllKeys, Keys } from "../../engine/input/Keys";
import { StateInput } from "../../engine/state/StateInput";
import { InputSourceInterface } from "../../engine/input/InputSourceInterface";
import { Keyboard } from "../../engine/input/Keyboard";
import { KeyboardInputSource } from "../../engine/input/KeyboardInputSource";
import { GamepadInputSource } from "../../engine/input/GamepadInputSource";

class MenuInput implements StateInput {
    private state: MenuState;
    private gamepad?: Gamepad;
    private keyboard: Keyboard;

    constructor(
        inputSources: Map<string, InputSourceInterface>,
        state: MenuState
    ) {
        this.state = state;

        const keyboardInputSource = inputSources.get("keyboard");
        const gamepadInputSource = inputSources.get("gamepad") as
            | GamepadInputSource
            | undefined;

        if (!(keyboardInputSource instanceof KeyboardInputSource)) {
            throw new Error("No keyboard input");
        }

        this.keyboard = keyboardInputSource.keyboard;
        this.gamepad = gamepadInputSource?.gamepad;
    }

    update() {
        const state = this.state;
        const selectedItem = state.currentMenu.selectedItem;

        // Do not change selection while editing
        if (!selectedItem.isEditing) {
            if (
                this.keyboard.keyboardDownOnce(Keys.UP) ||
                this.gamepad?.isStickDown("left", "up")
            ) {
                state.currentMenu.moveUp();
            } else if (
                this.keyboard.keyboardDownOnce(Keys.DOWN) ||
                this.gamepad?.isStickDown("left", "down")
            ) {
                state.currentMenu.moveDown();
            }
        }

        if (selectedItem.editable && selectedItem.isEditing) {
            if (this.keyboard.keyboardDownOnce(Keys.BACKSPACE)) {
                selectedItem.value = selectedItem.value.slice(0, -1);
            } else if (this.keyboard.lastPressedIsChar()) {
                if (
                    this.keyboard.keyboardDownOnce(
                        AllKeys[
                            this.keyboard.keyByCode(this.keyboard.lastPressed)
                        ]
                    )
                ) {
                    selectedItem.value += this.keyboard.lastPressedChar();
                }
            }
        }

        if (
            this.keyboard.keyboardDownOnce(Keys.ENTER) ||
            this.keyboard.keyboardDownOnce(Keys.SPACE) ||
            this.gamepad?.gamepadButtonDownOnce("actionSouth")
        ) {
            state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
