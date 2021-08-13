import { ComponentInterface } from "./ComponentInterface";

export class AliveComponent implements ComponentInterface {
    public static TYPE = 'AliveComponent';

    public isDead: boolean;

    constructor(isDead: boolean = false) {
        this.isDead = isDead;
    }

    get type() {
        return AliveComponent.TYPE;
    }
}
