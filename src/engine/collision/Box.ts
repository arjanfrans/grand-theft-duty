import {Polygon} from './Polygon';
import {Vector2} from "three";

// ## Box
//
// Represents an axis-aligned box, with a width and height.
// Create a new box, with the specified position, width, and height. If no position
// is given, the position will be `(0,0)`. If no width or height are given, they will
// be set to `0`.
/**
 * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
 * @param {?number=} w The width of the box.
 * @param {?number=} h The height of the box.
 * @constructor
 */
export class Box {
    public position: Vector2;
    public width: number;
    public height: number;

    constructor(position = new Vector2(), width: number = 0, height: number = 0) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    /**
     * Returns a polygon whose edges are the same as this box.
     */
    toPolygon(): Polygon {
        const pos = this.position;
        const w = this.width;
        const h = this.height;

        return new Polygon(new Vector2(pos.x, pos.y), [
            new Vector2(), new Vector2(w, 0),
            new Vector2(w, h), new Vector2(0, h)
        ]);
    }
}
