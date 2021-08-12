import { SystemUpdateInterface } from "./SystemUpdateInterface";
import { StateInput } from "../state/StateInput";

export class ControllerUpdateSystem implements SystemUpdateInterface {
    private readonly controllers: StateInput[];

    constructor(controllers: StateInput[]) {
        this.controllers = controllers;
    }

    public update(delta: number): boolean {
        for (const controller of this.controllers) {
            controller.update(delta);
        }

        return true;
    }
}
