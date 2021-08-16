import { MovementComponent } from "../components/MovementComponent";
import { AliveComponent } from "../components/AliveComponent";
import { PlayerControllableComponent } from "../components/PlayerControllableComponent";
import { WeaponComponent } from "../components/WeaponComponent";
import { Keys, LetterKeys } from "../../engine/input/Keys";
import { Keyboard } from "../../engine/input/Keyboard";
import Gamepad from "../../engine/input/Gamepad";
import { InputSourceInterface } from "../../engine/input/InputSourceInterface";
import { GamepadInputSource } from "../../engine/input/GamepadInputSource";
import { KeyboardInputSource } from "../../engine/input/KeyboardInputSource";
import { SystemInterface } from "./SystemInterface";
import { EntityManager } from "../entities/EntityManager";
import { Entity } from "../entities/Entity";
import { PlayState } from "../../state/PlayState";

export class PlayerControllableSystem implements SystemInterface {
    private keyboard: Keyboard;
    private gamepad?: Gamepad;
    public static REQUIRED_COMPONENTS = [
        MovementComponent.TYPE,
        AliveComponent.TYPE,
        PlayerControllableComponent.TYPE,
        WeaponComponent.TYPE,
    ];
    private em: EntityManager;
    private state: PlayState;

    constructor(
        state: PlayState,
        inputSources: Map<string, InputSourceInterface>
    ) {
        this.state = state;
        this.em = state.em;

        const keyboardInputSource = inputSources.get("keyboard");
        const gamepadInputSource = inputSources.get("gamepad") as
            | GamepadInputSource
            | undefined;

        if (!(keyboardInputSource instanceof KeyboardInputSource)) {
            throw new Error("No keyboard input");
        }

        this.keyboard = keyboardInputSource.keyboard;
        this.gamepad = gamepadInputSource?.gamepad;
    }

    private getEntities(): Entity[] {
        return this.em.getEntitiesWithTypes(
            PlayerControllableSystem.REQUIRED_COMPONENTS
        );
    }

    update(delta: number): void {
        for (const entity of this.getEntities()) {
            const movement = entity.getComponent<MovementComponent>(
                MovementComponent.TYPE
            );
            const weapon = entity.getComponent<WeaponComponent>(
                WeaponComponent.TYPE
            );

            if (
                this.keyboard.isDown(LetterKeys.E) ||
                this.gamepad?.gamepadButtonDownOnce("leftBumper")
            ) {
                this.state.showScores = true;
            } else {
                this.state.showScores = false;
            }

            if (this.keyboard.keyboardDownOnce(Keys.ESC)) {
                this.state.isPaused = !this.state.isPaused;
            }

            if (
                this.keyboard.isDown(Keys.UP) ||
                this.gamepad?.isStickDown("left", "up")
            ) {
                movement.moveUp();
            } else if (
                this.keyboard.isDown(Keys.DOWN) ||
                this.gamepad?.isStickDown("left", "down")
            ) {
                movement.moveDown();
            } else {
                movement.stopMoving();
            }

            if (
                this.keyboard.isDown(Keys.RIGHT) ||
                this.gamepad?.isStickDown("right", "right")
            ) {
                movement.turnRight();
            } else if (
                this.keyboard.isDown(Keys.LEFT) ||
                this.gamepad?.isStickDown("right", "left")
            ) {
                movement.turnLeft();
            } else {
                movement.stopTurning();
            }

            if (
                !movement.isRunning &&
                (this.keyboard.isDown(Keys.CTRL) ||
                    this.gamepad?.isDown("rightTrigger"))
            ) {
                weapon.fireBullet();
            }

            if (
                this.keyboard.isDown(Keys.SHIFT) ||
                this.gamepad?.isDown("actionSouth")
            ) {
                movement.isRunning = true;
            } else {
                movement.isRunning = false;
            }

            if (
                this.keyboard.keyboardDownOnce(LetterKeys.R) ||
                this.gamepad?.gamepadButtonDownOnce("actionWest")
            ) {
                weapon.reload();
            }

            if (
                this.keyboard.keyboardDownOnce(LetterKeys.X) ||
                this.gamepad?.gamepadButtonDownOnce("actionNorth")
            ) {
                weapon.scrollWeaponsDown();
            }

            if (
                this.keyboard.keyboardDownOnce(LetterKeys.Z) ||
                this.gamepad?.gamepadButtonDownOnce("actionEast")
            ) {
                weapon.scrollWeaponsUp();
            }
        }
    }
}
