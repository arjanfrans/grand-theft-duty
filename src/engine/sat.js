let Vector2 = require('math-utils').Vector2;
let Line2 = require('math-utils').Line2;

let convexHull = require('../utils/graham');


let _simpleAxis = function (vertices) {
    let axis = [];

    for(let i = 0; i < vertices.length; i++) {
        let v1 = vertices[i];
        let v2 = vertices[vertices.length === i + 1 ? 0 : i + 1)]

        let edge = v1.subtract(v2);

        let normal = edge.perp();

        axis.push(normal);
    }

    return axis;
};

class Polygon {
    constructor (position, vertices) {
        this.vertices = vertices;
        this.angle = 0;
        this.position = position;
    }

    get length () {
        return this.vertices.length;
    }
    //
    // get axis () {
    //     let vectors = convexHull.calculate(this.vertices);
    //
    //     return vectors.map((item) => new Vector2(item.x, item.y));
    // }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }
}

/**
 * Flatten vertices of a given polygon.
 *
 * @param {Polygon} polygon - Polygon to flatten.
 * @param {Vector2} axis - Vector2 axis to flatten on.
 *
 * @return {object} min and max values on the given axis.
 */
let _project = function (polygon, axis) {
    axis = axis.normalize();

    let min = polygon.vertices[0].dot(axis);
    let max = min;

    for (let i = 0; i < polygon.length; i++) {
        let projection = polygon.vertices[i].dot(axis);

        if (projection < min) {
            min = projection;
        }

        if (projection > max) {
            max = projection;
        }
    }

    return {
        min: min,
        max: max
    };
};

let _overlapPolygons = function (polygonA, polygonB) {
    let verticesA = polygonA.vertices;
    let verticesB = polygonB.vertices;

    let offset = new Vector2(polygonA.x - polygonB.x, polygonA.y - polygonB.y);

    let axisA _simpleAxis(polygonA.vertices);
    let axisB _simpleAxis(polygonB.vertices);

    for (let i = 0; i < axis1.length; i++) {

    }
}



// function sat(polygonA, polygonB){
//     for (int i = 0; i < a.edges.length; i++){
//         vector axis = a.edges[i].direction; // Get the direction vector of the edge
//         axis = vec_normal(axis); // We need to find the normal of the axis vector.
//         axis = vec_unit(axis); // We also need to "normalize" this vector, or make its length/magnitude equal to 1
//
//         // Find the projection of the two polygons onto the axis
//         segment proj_a = project(a, axis), proj_b = project(b, axis);
//
//         if(!seg_overlap(proj_a, proj_b)) return false; // If they do not overlap, then return false
//     }
//
//     ... // Same thing for polygon b
//     // At this point, we know that there were always intersections, hence the two polygons must be colliding
//     return true;
// }
