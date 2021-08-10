import { PlayState } from "../PlayState";
import { Keys, LetterKeys } from "../../../engine/input/Keys";
import { StateInput } from "../../../engine/state/StateInput";
import { InputSourceInterface } from "../../../engine/input/InputSourceInterface";
import { KeyboardInputSource } from "../../../engine/input/KeyboardInputSource";
import { Keyboard } from "../../../engine/input/Keyboard";
import { GamepadInputSource } from "../../../engine/input/GamepadInputSource";
import Gamepad from "../../../engine/input/Gamepad";

export class UiInput implements StateInput {
    private keyboard: Keyboard;
    private gamepad?: Gamepad;
    private state: PlayState;

    constructor(inputSources: Map<string, InputSourceInterface>, state) {
        const keyboardInputSource = inputSources.get("keyboard");
        const gamepadInputSource = inputSources.get("gamepad") as
            | GamepadInputSource
            | undefined;

        if (!(keyboardInputSource instanceof KeyboardInputSource)) {
            throw new Error("No keyboard input");
        }

        this.keyboard = keyboardInputSource.keyboard;
        this.gamepad = gamepadInputSource?.gamepad;

        this.state = state;
    }

    update(delta) {
        if (
            this.keyboard.isDown(LetterKeys.E) ||
            this.gamepad?.gamepadButtonDownOnce("leftBumper")
        ) {
            this.state.showScores = true;
        } else {
            this.state.showScores = false;
        }

        if (this.keyboard.keyboardDownOnce(Keys.ESC)) {
            if (this.state.paused) {
                this.state.resume();
            } else {
                this.state.pause();
            }
        }
    }
}
