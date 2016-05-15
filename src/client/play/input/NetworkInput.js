import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';
import HumanInput from '../../../engine/input/HumanInput';

class NetworkInput extends HumanInput {
    constructor (player, state) {
        super();

        this.player = player;
        this.state = state;
        this.previousInputs = [];
    }

    update () {
        const inputs = [];

        if (Keyboard.isDown(Keyboard.UP) || Gamepad.isStickDown(this.gamepadIndex, 'left', 'up')) {
            inputs.push('moveUp');
        } else if (Keyboard.isDown(Keyboard.DOWN) || Gamepad.isStickDown(this.gamepadIndex, 'left', 'down')) {
            inputs.push('moveDown');
        }

        if (Keyboard.isDown(Keyboard.RIGHT) || Gamepad.isStickDown(this.gamepadIndex, 'right', 'right')) {
            inputs.push('turnRight');
        } else if (Keyboard.isDown(Keyboard.LEFT) || Gamepad.isStickDown(this.gamepadIndex, 'right', 'left')) {
            inputs.push('turnLeft');
        }

        if (!this.player.isRunning && (Keyboard.isDown(Keyboard.CTRL) ||
                Gamepad.isDown(this.gamepadIndex, 'rightTrigger'))) {
            inputs.push('startFireing');
        } else if (!this.previousInputs.includes('stopFireing')) {
            inputs.push('stopFireing');
        }

        if (Keyboard.isDown(Keyboard.SHIFT) || Gamepad.isDown(this.gamepadIndex, 'actionSouth')) {
            inputs.push('startRunning');
        } else if (!this.previousInputs.includes('stopRunning')) {
            inputs.push('stopRunning');
        }

        if (this.keyboardDownOnce(Keyboard.R) || this.gamepadButtonDownOnce('actionWest')) {
            inputs.push('reload');
        }

        if (this.keyboardDownOnce(Keyboard.X) || this.gamepadButtonDownOnce('actionNorth')) {
            // this.player.scrollWeapons('down');
            // inputs.push('scrollWeaponDown');
        }

        if (this.keyboardDownOnce(Keyboard.Z) || this.gamepadButtonDownOnce('actionEast')) {
            // this.player.scrollWeapons('up');
            // inputs.push('scrollWeaponUp');
        }

        this.previousInputs = inputs.slice(0);

        if (this.state && this.state.network) {
            if (inputs.length > 0) {
                this.state.inputSeq += 1;

                const data = {
                    inputs: inputs,
                    time: this.state.localTime,
                    seq: this.state.inputSeq
                };

                this.player.inputs.push(data);

                this.state.network.emit('input', data);
            }
        }
    }
}

export default NetworkInput;
