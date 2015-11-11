let debug = require('debug')('game:engine/collision/sat');

// Version 0.5.0 - Copyright 2012 - 2015 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.5.0 - Copyright 2012 - 2015 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

let Vector = require('./Vector');
let Box = require('./Box');
let Response = require('./Response');

// ## Object Pools

// A pool of `Vector` objects that are used in calculations to avoid
// allocating memory.
/**
 * @type {Array.<Vector>}
 */
let T_VECTORS = [];

for (let i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }

// A pool of arrays of numbers used in calculations to avoid allocating
// memory.
/**
 * @type {Array.<Array.<number>>}
 */
let T_ARRAYS = [];

for (let i = 0; i < 5; i++) { T_ARRAYS.push([]); }

// Temporary response used for polygon hit detection.
/**
 * @type {Response}
 */
let T_RESPONSE = new Response();

// Unit square polygon used for polygon hit detection.
/**
 * @type {Polygon}
 */
let UNIT_SQUARE = new Box(new Vector(), 1, 1).toPolygon();

// ## Helper Functions

/**
 * Flattens the specified array of vertices onto a unit vector axis,
 * resulting in a one dimensional range of the minimum and
 * maximum value on that axis.
 * @param {Array.<Vector>} vertices The vertices to flatten.
 * @param {Vector} normal The unit vector axis to flatten on.
 * @param {Array.<number>} result An array.  After calling this function,
 *   result[0] will be the minimum value,
 *   result[1] will be the maximum value.
 *
 * @returns {void}
 */
let _flattenVerticesOn = function (vertices, normal, result) {
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    let len = vertices.length;

    for (let i = 0; i < len; i++) {
        // The magnitude of the projection of the point onto the normal
        let dot = vertices[i].dot(normal);

        if (dot < min) {
            min = dot;
        }
        if (dot > max) {
            max = dot;
        }
    }

    result[0] = min; result[1] = max;
};

/**
 * Check whether two convex polygons are separated by the specified
 * axis (must be a unit vector).
 *
 * @param {Vector} aPos The position of the first polygon.
 * @param {Vector} bPos The position of the second polygon.
 * @param {Array.<Vector>} aPoints The vertices in the first polygon.
 * @param {Array.<Vector>} bPoints The vertices in the second polygon.
 * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
 *   will be projected onto this axis.
 * @param {Response=} response A Response object (optional) which will be populated
 *   if the axis is not a separating axis.
 * @return {boolean} true if it is a separating axis, false otherwise.  If false,
 *   and a response is passed in, information about how much overlap and
 *   the direction of the overlap will be populated.
 */
let _isSeparatingAxis = function (aPos, bPos, aPoints, bPoints, axis, response) {
    let rangeA = T_ARRAYS.pop();
    let rangeB = T_ARRAYS.pop();

    // The magnitude of the offset between the two polygons
    let offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    let projectedOffset = offsetV.dot(axis);

    // Project the polygons onto the axis.
    _flattenVerticesOn(aPoints, axis, rangeA);
    _flattenVerticesOn(bPoints, axis, rangeB);

    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;

    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        T_VECTORS.push(offsetV);
        T_ARRAYS.push(rangeA);
        T_ARRAYS.push(rangeB);

        return true;
    }

    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
        let overlap = 0;

        // A starts further left than B
        if (rangeA[0] < rangeB[0]) {
            response.aInB = false;

            // A ends before B does. We have to pull A out of B
            if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0];
                response.bInA = false;
            } else {
                // B is fully inside A.  Pick the shortest way out.
                let option1 = rangeA[1] - rangeB[0];
                let option2 = rangeB[1] - rangeA[0];

                overlap = option1 < option2 ? option1 : -option2;
            }
        } else {
            // B starts further left than A
            response.bInA = false;

            // B ends before A ends. We have to push A out of B
            if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1];
                response.aInB = false;

                // A is fully inside B.  Pick the shortest way out.
            } else {
                let option1 = rangeA[1] - rangeB[0];
                let option2 = rangeB[1] - rangeA[0];

                overlap = option1 < option2 ? option1 : -option2;
            }
        }

        // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
        let absOverlap = Math.abs(overlap);

        if (absOverlap < response.overlap) {
            response.overlap = absOverlap;
            response.overlapN.copy(axis);
            if (overlap < 0) {
                response.overlapN.negate();
            }
        }
    }

    T_VECTORS.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);

    return false;
};

// Calculates which Voronoi region a point is on a line segment.
// It is assumed that both the line and the point are relative to `(0,0)`
//
//            |       (0)      |
//     (-1)  [S]--------------[E]  (1)
//            |       (0)      |
/**
 * @param {Vector} line The line segment.
 * @param {Vector} point The point.
 * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
 *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
 *          RIGHT_VORONOI_REGION (1) if it is the right region.
 */
let _vornoiRegion = function (line, point) {
    let len2 = line.len2();
    let dp = point.dot(line);

    // If the point is beyond the start of the line, it is in the
    // left voronoi region.
    if (dp < 0) {
        return LEFT_VORONOI_REGION;
    } else if (dp > len2) {
        // If the point is beyond the end of the line, it is in the
        // right voronoi region.

        return RIGHT_VORONOI_REGION;
    } else {
        // Otherwise, it's in the middle one.
        return MIDDLE_VORONOI_REGION;
    }
};

// Constants for Voronoi regions
/**
 * @const
 */
let LEFT_VORONOI_REGION = -1;

/**
 * @const
 */
let MIDDLE_VORONOI_REGION = 0;

/**
 * @const
 */
let RIGHT_VORONOI_REGION = 1;

// ## Collision Tests

// Check if a point is inside a circle.
/**
 * @param {Vector} p The point to test.
 * @param {Circle} c The circle to test.
 * @return {boolean} true if the point is inside the circle, false if it is not.
 */
let _pointInCircle = function (p, c) {
    let differenceV = T_VECTORS.pop().copy(p).sub(c.position);
    let radiusSq = c.radius * c.radius;
    let distanceSq = differenceV.len2();

    T_VECTORS.push(differenceV);

    // If the distance between is smaller than the radius then the point is inside the circle.
    return distanceSq <= radiusSq;
};

// Check if a point is inside a convex polygon.
/**
 * @param {Vector} p The point to test.
 * @param {Polygon} poly The polygon to test.
 * @return {boolean} true if the point is inside the polygon, false if it is not.
 */
let _pointInPolygon = function (p, poly) {
    UNIT_SQUARE.position.copy(p);
    T_RESPONSE.clear();

    let result = testPolygonPolygon(UNIT_SQUARE, poly, T_RESPONSE);

    if (result) {
        result = T_RESPONSE.aInB;
    }
    return result;
};

// Check if two circles collide.
/**
 * @param {Circle} a The first circle.
 * @param {Circle} b The second circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   the circles intersect.
 * @return {boolean} true if the circles intersect, false if they don't.
 */
let _testCircleCircle = function (a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    let differenceV = T_VECTORS.pop().copy(b.position).sub(a.position);
    let totalRadius = a.radius + b.radius;
    let totalRadiusSq = totalRadius * totalRadius;
    let distanceSq = differenceV.len2();

    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
        T_VECTORS.push(differenceV);

        return false;
    }

    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) {
        let dist = Math.sqrt(distanceSq);

        response.a = a;
        response.b = b;
        response.overlap = totalRadius - dist;
        response.overlapN.copy(differenceV.normalize());
        response.overlapV.copy(differenceV).scale(response.overlap);
        response.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
        response.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
    }

    T_VECTORS.push(differenceV);

    return true;
};

// Check if a polygon and a circle collide.
/**
 * @param {Polygon} polygon The polygon.
 * @param {Circle} circle The circle.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
let _testPolygonCircle = function (polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    let circlePos = T_VECTORS.pop().copy(circle.position).sub(polygon.position);
    let radius = circle.radius;
    let radius2 = radius * radius;
    let points = polygon.computedVertices;
    let len = points.length;
    let edge = T_VECTORS.pop();
    let point = T_VECTORS.pop();

    // For each edge in the polygon:
    for (let i = 0; i < len; i++) {
        let next = i === len - 1 ? 0 : i + 1;
        let prev = i === 0 ? len - 1 : i - 1;
        let overlap = 0;
        let overlapN = null;

        // Get the edge.
        edge.copy(polygon.edges[i]);

        // Calculate the center of the circle relative to the starting point of the edge.
        point.copy(circlePos).sub(points[i]);

        // If the distance between the center of the circle and the point
        // is bigger than the radius, the polygon is definitely not fully in
        // the circle.
        if (response && point.len2() > radius2) {
            response.aInB = false;
        }

        // Calculate which Voronoi region the center of the circle is in.
        let region = _vornoiRegion(edge, point);

        // If it's the left region:
        if (region === LEFT_VORONOI_REGION) {
            // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
            edge.copy(polygon.edges[prev]);

            // Calculate the center of the circle relative the starting point of the previous edge
            let point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);

            region = _vornoiRegion(edge, point2);

            if (region === RIGHT_VORONOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                let dist = point.len();

                if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    T_VECTORS.push(point2);

                    return false;
                } else if (response) {
                    // It intersects, calculate the overlap.
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }

            T_VECTORS.push(point2);

        // If it's the right region:
        } else if (region === RIGHT_VORONOI_REGION) {
            // We need to make sure we're in the left region on the next edge
            edge.copy(polygon.edges[next]);

            // Calculate the center of the circle relative to the starting point of the next edge.
            point.copy(circlePos).sub(points[next]);
            region = _vornoiRegion(edge, point);
            if (region === LEFT_VORONOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                let dist = point.len();

                if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);

                    return false;
                } else if (response) {
                    // It intersects, calculate the overlap.
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }

        // Otherwise, it's the middle region:
        } else {
            // Need to check if the circle is intersecting the edge,
            // Change the edge into its "edge normal".
            let normal = edge.perp().normalize();

            // Find the perpendicular distance between the center of the
            // circle and the edge.
            let dist = point.dot(normal);
            let distAbs = Math.abs(dist);

            // If the circle is on the outside of the edge, there is no intersection.
            if (dist > 0 && distAbs > radius) {
                // No intersection
                T_VECTORS.push(circlePos);
                T_VECTORS.push(normal);
                T_VECTORS.push(point);

                return false;
            } else if (response) {
                // It intersects, calculate the overlap.
                overlapN = normal;
                overlap = radius - dist;

                // If the center of the circle is on the outside of the edge, or part of the
                // circle is on the outside, the circle is not fully inside the polygon.
                if (dist >= 0 || overlap < 2 * radius) {
                    response.bInA = false;
                }
            }
        }

        // If this is the smallest overlap we've seen, keep it.
        // (overlapN may be null if the circle was in the wrong Voronoi region).
        if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
            response.overlap = overlap;
            response.overlapN.copy(overlapN);
        }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
        response.a = polygon;
        response.b = circle;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
    }

    T_VECTORS.push(circlePos);
    T_VECTORS.push(edge);
    T_VECTORS.push(point);

    return true;
};

// Check if a circle and a polygon collide.
//
// **NOTE:** This is slightly less efficient than polygonCircle as it just
// runs polygonCircle and reverses everything at the end.
/**
 * @param {Circle} circle The circle.
 * @param {Polygon} polygon The polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
let _testCirclePolygon = function (circle, polygon, response) {
    // Test the polygon against the circle.
    let result = testPolygonCircle(polygon, circle, response);

    if (result && response) {
        // Swap A and B in the response.
        let a = response.a;
        let aInB = response.aInB;

        response.overlapN.negate();
        response.overlapV.negate();
        response.a = response.b;
        response.b = a;
        response.aInB = response.bInA;
        response.bInA = aInB;
    }

    return result;
};

/**
 * Checks whether polygons collide.
 * @param {Polygon} a The first polygon.
 * @param {Polygon} b The second polygon.
 * @param {Response=} response Response object (optional) that will be populated if
 *   they interset.
 * @return {boolean} true if they intersect, false if they don't.
 */
let _testPolygonPolygon = function (a, b, response) {
    let aPoints = a.computedVertices;
    let aLen = aPoints.length;
    let bPoints = b.computedVertices;
    let bLen = bPoints.length;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (let i = 0; i < aLen; i++) {
        if (_isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i], response)) {
            return false;
        }
    }

    // If any of the edge normals of B is a separating axis, no intersection.
    for (let i = 0;i < bLen; i++) {
        if (_isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i], response)) {
            return false;
        }
    }

    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in _isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
        response.a = a;
        response.b = b;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
    }

    return true;
};

module.exports = {
    testPolygonPolygon: _testPolygonPolygon,
    testCirclePolygon: _testCirclePolygon,
    testPolygonCircle: _testPolygonCircle,
    testCircleCircle: _testCircleCircle,
    pointInPolygon: _pointInPolygon,
    pointInCircle: _pointInCircle
};
