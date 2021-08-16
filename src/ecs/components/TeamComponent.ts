import { ComponentInterface } from "./ComponentInterface";

export class TeamComponent implements ComponentInterface {
    public static TYPE = "TeamComponent";

    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    get type(): string {
        return TeamComponent.TYPE;
    }
}
