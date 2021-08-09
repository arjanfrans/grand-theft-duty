import Gamepad from '../../../engine/input/Gamepad';
import {HumanInput} from '../../../engine/input/HumanInput';
import Player from "../../../core/entities/Player";
import {Keys, LetterKeys} from "../../../engine/input/Keys";
import {StateInput} from "../../../engine/state/StateInput";
import {InputSourceInterface} from "../../../engine/input/InputSourceInterface";

export class PlayerInput implements StateInput {
    private input: HumanInput;
    private player: Player;

    constructor (inputSources: Map<string, InputSourceInterface>, player) {
        this.input = new HumanInput(inputSources);

        this.player = player;
    }

    update (delta) {
        if (this.input.keyboard.isDown(Keys.UP) || Gamepad.isStickDown(this.input.gamepadIndex, 'left', 'up')) {
            this.player.moveUp();
        } else if (this.input.keyboard.isDown(Keys.DOWN) || Gamepad.isStickDown(this.input.gamepadIndex, 'left', 'down')) {
            this.player.moveDown();
        } else {
            this.player.stopMoving();
        }

        if (this.input.keyboard.isDown(Keys.RIGHT) || Gamepad.isStickDown(this.input.gamepadIndex, 'right', 'right')) {
            this.player.turnRight();
        } else if (this.input.keyboard.isDown(Keys.LEFT) || Gamepad.isStickDown(this.input.gamepadIndex, 'right', 'left')) {
            this.player.turnLeft();
        } else {
            this.player.stopTurning();
        }

        if (!this.player.isRunning && (this.input.keyboard.isDown(Keys.CTRL) ||
                Gamepad.isDown(this.input.gamepadIndex, 'rightTrigger'))) {
            this.player.fireBullet();
        }

        if (this.input.keyboard.isDown(Keys.SHIFT) || Gamepad.isDown(this.input.gamepadIndex, 'actionSouth')) {
            this.player.isRunning = true;
        } else {
            this.player.isRunning = false;
        }

        if (this.input.keyboardDownOnce(LetterKeys.R) || this.input.gamepadButtonDownOnce('actionWest')) {
            this.player.reload();
        }

        if (this.input.keyboardDownOnce(LetterKeys.X) || this.input.gamepadButtonDownOnce('actionNorth')) {
            this.player.scrollWeapons('down');
        }

        if (this.input.keyboardDownOnce(LetterKeys.Z) || this.input.gamepadButtonDownOnce('actionEast')) {
            this.player.scrollWeapons('up');
        }
    }
}
