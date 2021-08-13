import { Engine } from "../Engine";
import {AbstractState} from "./AbstractState";

export class NullState extends AbstractState {
    constructor(engine: Engine) {
        super("null", engine);
    }

    update(delta: number) {}
}
