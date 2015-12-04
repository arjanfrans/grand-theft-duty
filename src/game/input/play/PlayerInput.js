import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';
import HumanInput from '../../../engine/input/HumanInput';

class PlayerInput extends HumanInput {
    constructor (player) {
        super();

        this.player = player;
    }

    update (delta) {
        if (Keyboard.isDown(Keyboard.UP) || Gamepad.isStickDown(this.gamepadIndex, 'left', 'up')) {
            this.player.moveUp();
        } else if (Keyboard.isDown(Keyboard.DOWN) || Gamepad.isStickDown(this.gamepadIndex, 'left', 'down')) {
            this.player.moveDown();
        } else {
            this.player.stopMoving();
        }

        if (Keyboard.isDown(Keyboard.RIGHT) || Gamepad.isStickDown(this.gamepadIndex, 'right', 'right')) {
            this.player.turnRight();
        } else if (Keyboard.isDown(Keyboard.LEFT) || Gamepad.isStickDown(this.gamepadIndex, 'right', 'left')) {
            this.player.turnLeft();
        } else {
            this.player.stopTurning();
        }

        if (!this.player.isRunning && (Keyboard.isDown(Keyboard.CTRL) ||
                Gamepad.isDown(this.gamepadIndex, 'rightTrigger'))) {
            this.player.fireBullet();
        }

        if (Keyboard.isDown(Keyboard.SHIFT) || Gamepad.isDown(this.gamepadIndex, 'actionSouth')) {
            this.player.isRunning = true;
        } else {
            this.player.isRunning = false;
        }

        if (this.keyboardDownOnce(Keyboard.R) || this.gamepadButtonDownOnce('actionWest')) {
            this.player.reload();
        }

        if (this.keyboardDownOnce(Keyboard.X) || this.gamepadButtonDownOnce('actionNorth')) {
            this.player.scrollWeapons('down');
        }

        if (this.keyboardDownOnce(Keyboard.Z) || this.gamepadButtonDownOnce('actionEast')) {
            this.player.scrollWeapons('up');
        }
    }
}

export default PlayerInput;
