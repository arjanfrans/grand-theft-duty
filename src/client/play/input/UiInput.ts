import PlayState from "../PlayState";
import {Keys, LetterKeys} from "../../../engine/input/Keys";
import {HumanInput} from "../../../engine/input/HumanInput";
import {StateInput} from "../../../engine/state/StateInput";
import {InputSourceInterface} from "../../../engine/input/InputSourceInterface";

export class UiInput implements StateInput  {
    private input: HumanInput;
    private state: PlayState;

    constructor (inputSources: Map<string, InputSourceInterface>, state) {
        this.input = new HumanInput(inputSources);

        this.state = state;
    }

    update (delta) {
        if (this.input.keyboard.isDown(LetterKeys.E) || this.input.gamepadButtonDownOnce('leftBumper')) {
            this.state.showScores = true;
        } else {
            this.state.showScores = false;
        }

        if (this.input.keyboardDownOnce(Keys.ESC)) {
            if (this.state.paused) {
                this.state.resume();
            } else {
                this.state.pause();
            }
        }
    }
}
