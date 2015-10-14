let Keyboard = require('../utils/keyboard');

class PlayerInput {
    constructor (player) {
        this.player = player;
    }

    update () {
        if (Keyboard.isDown(Keyboard.UP)) {
            this.player.moveUp();
        } else {
            this.player.stop();
        }
    }

}
