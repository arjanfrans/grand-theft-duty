'use strict';

let Vector = require('./Vector');

let _boxToPolygon = function (position, width, height) {
    return new Polygon(new Vector(position.x, position.y), [
        new Vector(), new Vector(width, 0),
        new Vector(width, height), new Vector(0, height)
    ]);
};

// ## Polygon
//
// Represents a *convex* polygon with any number of vertices (specified in counter-clockwise order)
//
// Note: Do _not_ manually change the `vertices`, `angle`, or `offset` properties. Use the
// provided setters. Otherwise the calculated properties will not be updated correctly.
//
// `pos` can be changed directly.

// Create a new polygon, passing in a position vector, and an array of vertices (represented
// by vectors relative to the position vector). If no position is passed in, the position
// of the polygon will be `(0,0)`.
/**
 * @param {Vector=} pos A vector representing the origin of the polygon. (all other
 *   vertices are relative to this one)
 * @param {Array.<Vector>=} vertices An array of vectors representing the vertices in the polygon,
 *   in counter-clockwise order.
 * @constructor
 */
class Polygon {
    constructor (position = new Vector(), vertices = []) {
        this.position = position;
        this.angle = 0;
        this.offset = new Vector();

        this.setVertices(vertices);
    }

    /**
     * Set the vertices of the polygon.
     * Note: The vertices are counter-clockwise *with respect to the coordinate system*.
     * If you directly draw the vertices on a screen that has the origin at the top-left corner
     * it will _appear_ visually that the vertices are being specified clockwise. This is just
     * because of the inversion of the Y-axis when being displayed.
     *
     * @param {Array.<Vector>=} vertices An array of vectors representing the vertices in the polygon,
     *   in counter-clockwise order.
     * @return {Polygon} This for chaining.
     */
    setVertices (vertices) {
        // Only re-allocate if this is a new polygon or the number of vertices has changed.
        let lengthChanged = !this.vertices || this.vertices.length !== vertices.length;

        if (lengthChanged) {
            let computedVertices = this.computedVertices = [];
            let edges = this.edges = [];
            let normals = this.normals = [];

            // Allocate the vector arrays for the calculated properties
            for (let i = 0; i < vertices.length; i++) {
                computedVertices.push(new Vector());
                edges.push(new Vector());
                normals.push(new Vector());
            }
        }
        this.vertices = vertices;
        this._compute();

        return this;
    }

    /**
     * Set the current rotation angle of the polygon.
     *
     * @param {number} angle The current rotation angle (in radians).
     * @return {Polygon} This for chaining.
     */
    setAngle (angle) {
        this.angle = angle;
        this._compute();

        return this;
    }

    /**
     * Set the current offset to apply to the `vertices` before applying the `angle` rotation.
     *
     * @param {Vector} offset The new offset vector.
     * @return {Polygon} This for chaining.
     */
    setOffset (offset) {
        this.offset = offset;
        this._compute();

        return this;
    }

    /**
     * Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
     * Note: This changes the **original** vertices (so any `angle` will be applied on top of this rotation).
     * @param {number} angle The angle to rotate (in radians)
     * @return {Polygon} This for chaining.
     */
    rotate (angle) {
        let vertices = this.vertices;
        let len = vertices.length;

        for (let i = 0; i < len; i++) {
            vertices[i].rotate(angle);
        }

        this._compute();

        return this;
    }

    /**
     * Translates the vertices of this polygon by a specified amount relative to the origin of *its own coordinate
     * system* (i.e. `pos`).
     *
     * This is most useful to change the "center vertex" of a polygon. If you just want to move the whole polygon, change
     * the coordinates of `pos`.
     *
     * Note: This changes the **original** vertices (so any `offset` will be applied on top of this translation)
     *
     * @param {number} x The horizontal amount to translate.
     * @param {number} y The vertical amount to translate.
     * @return {Polygon} This for chaining.
     */
    translate (x, y) {
        let vertices = this.vertices;
        let len = vertices.length;

        for (let i = 0; i < len; i++) {
            vertices[i].x += x;
            vertices[i].y += y;
        }

        this._compute();

        return this;
    }

    /**
     * Computes the calculated collision polygon. Applies the `angle` and `offset` to the original vertices then recalculates the
     * edges and normals of the collision polygon.
     * @return {Polygon} This for chaining.
     */
    _compute () {
        // Calculated vertices - this is what is used for underlying collisions and takes into account
        // the angle/offset set on the polygon.
        let computedVertices = this.computedVertices;

        // The edges here are the direction of the `n`th edge of the polygon, relative to
        // the `n`th vertex. If you want to draw a given edge from the edge value, you must
        // first translate to the position of the starting vertex.
        let edges = this.edges;

        // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
        // to the position of the `n`th vertex. If you want to draw an edge normal, you must first
        // translate to the position of the starting vertex.
        let normals = this.normals;

        // Copy the original vertices array and apply the offset/angle
        let vertices = this.vertices;
        let offset = this.offset;
        let angle = this.angle;
        let len = vertices.length;

        for (let i = 0; i < len; i++) {
            let computedVertex = computedVertices[i].copy(vertices[i]);

            computedVertex.x += offset.x;
            computedVertex.y += offset.y;

            if (angle !== 0) {
                computedVertex.rotate(angle);
            }
        }

        // Calculate the edges/normals
        for (let i = 0; i < len; i++) {
            let p1 = computedVertices[i];
            let p2 = i < len - 1 ? computedVertices[i + 1] : computedVertices[0];
            let e = edges[i].copy(p2).sub(p1);

            normals[i].copy(e).perp().normalize();
        }

        return this;
    }

    /**
     * Compute the axis-aligned bounding box. Any current state
     * (translations/rotations) will be applied before constructing the AABB.
     *
     *  Note: Returns a _new_ `Polygon` each time you call this.
     *
     * @return {Polygon} The AABB
     */
    getAABB () {
        let vertices = this.computedVertices;
        let len = vertices.length;
        let xMin = vertices[0].x;
        let yMin = vertices[0].y;
        let xMax = vertices[0].x;
        let yMax = vertices[0].y;

        for (let i = 1; i < len; i++) {
            let vertex = vertices[i];

            if (vertex.x < xMin) {
                xMin = vertex.x;
            } else if (vertex.x > xMax) {
                xMax = vertex.x;
            }

            if (vertex.y < yMin) {
                yMin = vertex.y;
            } else if (vertex.y > yMax) {
                yMax = vertex.y;
            }
        }

        return boxToPolygon(this.position.clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin);
    }
}

module.exports = Polygon;
