import { HumanInput, Keyboard } from '../../../engine/input';

class UiInput extends HumanInput {
    constructor (state) {
        super();

        this.state = state;
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.E) || this.gamepadButtonDownOnce('leftBumper')) {
            this.state.showScores = true;
        } else {
            this.state.showScores = false;
        }

        if (this.keyboardDownOnce(Keyboard.ESC)) {
            if (this.state.paused) {
                this.state.resume();
            } else {
                this.state.pause();
            }
        }
    }
}

export default UiInput;
