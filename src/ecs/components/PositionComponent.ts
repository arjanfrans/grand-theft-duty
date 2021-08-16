import { Vector3 } from "three";
import { ComponentInterface } from "./ComponentInterface";

export class PositionComponent implements ComponentInterface {
    public static TYPE: string = "PositionComponent";

    public readonly position: Vector3;
    public readonly previousPosition: Vector3;

    constructor(x: number, y: number, z = 0) {
        this.position = new Vector3(x, y, z);
        this.previousPosition = this.position.clone();
    }

    public respawn(x: number, y: number, z: number): void {}

    get type(): string {
        return PositionComponent.TYPE;
    }
}
