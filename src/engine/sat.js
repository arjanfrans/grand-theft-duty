let Vector2 = require('math-utils').Vector2;

// let convexHull = require('../utils/graham');

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

let _doesProjectionIntersect = function (a, b) {
    return a.min.x <= b.max.x &&
        a.max.x >= b.min.x &&
        a.min.y <= b.max.y &&
        a.max.y >= b.min.y;
};

let _overlapPolygons = function (polygonA, polygonB) {
    let verticesA = polygonA.vertices;
    let verticesB = polygonB.vertices;

    let axesA = polygonA.axis;
    let axesB = polygonB.axis;

    for (let i = 0; i < axesA.length; i++) {
        let axis = axesA[i];
        let projectionA = _project(polygonA, axis);
        let projectionB = _project(polygonB, axis);

        if (!_doesProjectionIntersect(projectionA, projectionB)) {
            return false;
        }
    }

    for (let i = 0; i < axesB.length; i++) {
        let axis = axesB[i];
        let projectionA = _project(polygonA, axis);
        let projectionB = _project(polygonB, axis);

        if (!_doesProjectionIntersect(projectionA, projectionB)) {
            return false;
        }
    }

    return true;
};

module.exports = {
    polygonsOverlap: _overlapPolygons
};
