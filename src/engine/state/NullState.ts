import {State} from "../../client/State";
import Engine from "../Engine";

export class NullState extends State
{
    constructor(engine: Engine) {
        super('null', engine);
    }

    update() {
    }
}
