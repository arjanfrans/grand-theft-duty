import Keyboard from '../../../engine/input/Keyboard';

class UiInput {
    constructor (uiView) {
        this.uiView = uiView;

        this.previousKeys = {};
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.E)) {
            this.uiView.showScores = true;
        } else {
            this.uiView.showScores = false;
        }

        // TODO gamepad input
    }
}

export default UiInput;
