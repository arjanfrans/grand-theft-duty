import Gamepad from "../../../engine/input/Gamepad";
import { Player } from "../../../core/entities/Player";
import { Keys, LetterKeys } from "../../../engine/input/Keys";
import { StateInput } from "../../../engine/state/StateInput";
import { InputSourceInterface } from "../../../engine/input/InputSourceInterface";
import { KeyboardInputSource } from "../../../engine/input/KeyboardInputSource";
import { Keyboard } from "../../../engine/input/Keyboard";
import { GamepadInputSource } from "../../../engine/input/GamepadInputSource";

export class PlayerInput implements StateInput {
    private keyboard: Keyboard;
    private gamepad?: Gamepad;
    private player: Player;

    constructor(inputSources: Map<string, InputSourceInterface>, player) {
        const keyboardInputSource = inputSources.get("keyboard");
        const gamepadInputSource = inputSources.get("gamepad") as
            | GamepadInputSource
            | undefined;

        if (!(keyboardInputSource instanceof KeyboardInputSource)) {
            throw new Error("No keyboard input");
        }

        this.keyboard = keyboardInputSource.keyboard;
        this.gamepad = gamepadInputSource?.gamepad;
        this.player = player;
    }

    update(delta) {
        if (
            this.keyboard.isDown(Keys.UP) ||
            this.gamepad?.isStickDown("left", "up")
        ) {
            this.player.moveUp();
        } else if (
            this.keyboard.isDown(Keys.DOWN) ||
            this.gamepad?.isStickDown("left", "down")
        ) {
            this.player.moveDown();
        } else {
            this.player.stopMoving();
        }

        if (
            this.keyboard.isDown(Keys.RIGHT) ||
            this.gamepad?.isStickDown("right", "right")
        ) {
            this.player.turnRight();
        } else if (
            this.keyboard.isDown(Keys.LEFT) ||
            this.gamepad?.isStickDown("right", "left")
        ) {
            this.player.turnLeft();
        } else {
            this.player.stopTurning();
        }

        if (
            !this.player.isRunning &&
            (this.keyboard.isDown(Keys.CTRL) ||
                this.gamepad?.isDown("rightTrigger"))
        ) {
            this.player.fireBullet();
        }

        if (
            this.keyboard.isDown(Keys.SHIFT) ||
            this.gamepad?.isDown("actionSouth")
        ) {
            this.player.isRunning = true;
        } else {
            this.player.isRunning = false;
        }

        if (
            this.keyboard.keyboardDownOnce(LetterKeys.R) ||
            this.gamepad?.gamepadButtonDownOnce("actionWest")
        ) {
            this.player.reload();
        }

        if (
            this.keyboard.keyboardDownOnce(LetterKeys.X) ||
            this.gamepad?.gamepadButtonDownOnce("actionNorth")
        ) {
            this.player.scrollWeapons("down");
        }

        if (
            this.keyboard.keyboardDownOnce(LetterKeys.Z) ||
            this.gamepad?.gamepadButtonDownOnce("actionEast")
        ) {
            this.player.scrollWeapons("up");
        }
    }
}
