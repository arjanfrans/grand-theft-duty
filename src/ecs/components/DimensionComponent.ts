import { ComponentInterface } from "./ComponentInterface";

export class DimensionComponent implements ComponentInterface {
    public static TYPE: string = "DimensionComponent";

    public width: number;
    public height: number;
    public depth: number;

    constructor(width: number, height: number, depth: number) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    get halfWidth() {
        return this.width / 2;
    }

    get halfHeight() {
        return this.height / 2;
    }

    get type(): string {
        return DimensionComponent.TYPE;
    }
}
