import { ComponentInterface } from "./ComponentInterface";

export class PlayerControllableComponent implements ComponentInterface {
    public static TYPE: string = "PlayerControllableComponent";

    get type(): string {
        return PlayerControllableComponent.TYPE;
    }
}
