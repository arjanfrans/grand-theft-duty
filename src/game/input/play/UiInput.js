let debug = require('debug')('game:engine/input/play/UiInput');

import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';

class UiInput {
    constructor (stats) {
        this.stats = stats;

        this.previousKeys = {};
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.E)) {
            this.stats.visible = true;
        } else {
            this.stats.visible = false;
        }

        // TODO gamepad input
    }
}

export default UiInput;
