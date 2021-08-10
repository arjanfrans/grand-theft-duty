import { AbstractState } from "../../client/AbstractState";
import { Engine } from "../Engine";

export class NullState extends AbstractState {
    constructor(engine: Engine) {
        super("null", engine);
    }

    update() {}
}
