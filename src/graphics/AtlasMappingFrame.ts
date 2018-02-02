import { Vector2 } from "three";

class AtlasMappingFrame {
    private id: string;
    private rotated: boolean;
    private trimmed: boolean;
    private rectangle: { x: number, y: number, width: number, height: number };
    private sourceRectangle: { x: number, y: number, width: number, height: number };
    private bounds: Vector2[] = [];
    private offset: Vector2;

    constructor(
        id: string,
        rotated: boolean,
        trimmed: boolean,
    ) {
        this.id = id;
        this.rotated = rotated;
        this.trimmed = trimmed;

        this.calculateOffset();
        this.calculateBounds();
    }

    public getId(): string {
        return this.id;
    }

    public setSource(x: number, y: number, width: number, height: number): void {
        this.sourceRectangle.x = x;
        this.sourceRectangle.y = y;
        this.sourceRectangle.width = width;
        this.sourceRectangle.height = height;
    }

    public setRectangle(x: number, y: number, width: number, height: number) {
        this.rectangle.x = x;
        this.rectangle.y = y;
        this.rectangle.width = width;
        this.rectangle.height = height;
    }

    public getWidth(): number {
        return this.rectangle.width;
    }

    public getHeight(): number {
        return this.rectangle.height;
    }

    public getX(): number {
        return this.rectangle.x;
    }

    public getY(): number {
        return this.rectangle.y;
    }

    public getBounds(): Vector2[] {
        return this.bounds;
    }

    public getOffset(): Vector2 {
        return this.offset;
    }

    private calculateOffset(): void {
        this.offset = new Vector2(
            this.getX() / this.getWidth(),
            (this.getHeight() - this.getY()) / this.getHeight(),
        );
    }

    private calculateBounds(): void {
        const { x, y, width, height } = this.rectangle;

        this.bounds = [
            new Vector2(x / width, (height - (y)) / height), // lower left
            new Vector2(x / width, (height - (y + height)) / height), // upper left
            new Vector2((x + width) / width, (height - (y + height)) / height), // upper right
            new Vector2((x + width) / width, (height - (y)) / height), // lower right
        ];
    }
}

export default AtlasMappingFrame;
