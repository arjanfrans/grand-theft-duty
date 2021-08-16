import { ComponentInterface } from "./ComponentInterface";

export class WalkingComponent implements ComponentInterface {
    public static TYPE: string = "WalkingComponent";

    get type(): string {
        return WalkingComponent.TYPE;
    }
}
