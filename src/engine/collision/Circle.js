import Vector from './Vector';
import Box from './Box';

// ## Circle
//
// Represents a circle with a position and a radius.

// Create a new circle, optionally passing in a position and/or radius. If no position
// is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
// have a radius of `0`.
/**
 * @param {Vector=} pos A vector representing the position of the center of the circle
 * @param {?number=} r The radius of the circle
 * @constructor
 */
class Circle {
    constructor (position = new Vector(), radius = 0) {
        this.position = position;
        this.radius = radius;
    }

    /**
     * Compute the axis-aligned bounding box (AABB) of this Circle.
     * Note: Returns a _new_ `Polygon` each time you call this.
     *
     * @return {Polygon} The AABB
     */
    getAABB () {
        let r = this.radius;
        let corner = this.position.clone().sub(new Vector(r, r));

        return new Box(corner, r * 2, r * 2).toPolygon();
    };
}

export default Circle;
