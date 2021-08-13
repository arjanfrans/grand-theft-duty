import {ComponentInterface} from "./ComponentInterface";

export class ComputerControllableComponent implements ComponentInterface {
    public static TYPE: string = 'ComputerControllableComponent'

    get type(): string
    {
        return ComputerControllableComponent.TYPE;
    }
}
