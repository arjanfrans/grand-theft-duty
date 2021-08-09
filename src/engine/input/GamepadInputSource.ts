import {InputSourceInterface} from "./InputSourceInterface";

import Gamepad from './Gamepad';

export class GamepadInputSource implements InputSourceInterface
{
    public readonly gamepad: Gamepad;

    constructor () {
        this.gamepad = new Gamepad();
    }
}
