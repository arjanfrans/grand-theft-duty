import Keyboard from '../../../engine/input/Keyboard';

class UiInput {
    constructor (state) {
        this.state = state;

        this.previousKeys = {};
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.E)) {
            this.state.showScores = true;
        } else {
            this.state.showScores = false;
        }

        // TODO gamepad input
    }
}

export default UiInput;
