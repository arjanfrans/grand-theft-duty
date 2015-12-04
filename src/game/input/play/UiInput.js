import Keyboard from '../../../engine/input/Keyboard';
import HumanInput from '../../../engine/input/HumanInput';

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
    }
}

export default UiInput;
