import {Vector2} from "three";
import {Box} from "./Box";
import {Polygon} from "./Polygon";

/**
 * Represents a circle with a position and a radius.
 * Create a new circle, optionally passing in a position and/or radius. If no position
 * is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
 * have a radius of `0`.
 */
export class Circle {
    public position: Vector2;
    public radius: number;

    /**
     *
     * @param position A vector representing the position of the center of the circle.
     * @param radius The radius of the circle.
     */
    constructor (position = new Vector2(), radius: number = 0) {
        this.position = position;
        this.radius = radius;
    }

    /**
     * Compute the axis-aligned bounding box (AABB) of this Circle.
     * Note: Returns a _new_ `Polygon` each time you call this.
     */
    getAABB (): Polygon {
        const r = this.radius;
        const corner = this.position.clone().sub(new Vector2(r, r));

        return new Box(corner, r * 2, r * 2).toPolygon();
    }
}
