import { Polygon } from "../math/Polygon";
import { Vector2 } from "three";
import { ObjectPool } from "../utils/ObjectPool";
import { Box } from "../math/Box";
import { Circle } from "../math/Circle";
import { VoronoiRegion } from "../math/VornoiRegion";
import { Vector2Helper } from "../math/Vector2Helper";
import { SatResult } from "./SatResult";

const POINT_POLYGON = new Box(new Vector2(), 0.00001, 0.00001).toPolygon();

/**
 * Determining intersections of circles and
 * polygons using the Separating Axis Theorem.
 *
 * Based on https://github.com/jriecken/sat-js (Version 0.5.0 - Copyright 2012 - 2015 -  Jim Riecken <jimr@jimr.ca>)
 */
export class SeparatingAxisTheorem {
    private arrayPool: ObjectPool<number[]>;
    private vectorPool: ObjectPool<Vector2>;
    private cachedSatResult: SatResult = new SatResult();

    constructor() {
        this.arrayPool = new ObjectPool<number[]>(() => [], 5, 5, 20);
        this.vectorPool = new ObjectPool<Vector2>(
            () => new Vector2(),
            10,
            10,
            40
        );
    }

    /**
     * Flattens the specified array of vertices onto a unit vector axis,
     * resulting in a one dimensional range of the minimum and
     * maximum value on that axis.
     * @param vertices The vertices to flatten.
     * @param normal The unit vector axis to flatten on.
     * @param result An array.  After calling this function,
     *   result[0] will be the minimum value,
     *   result[1] will be the maximum value.
     */
    private static flattenVerticesOn(
        vertices: Vector2[],
        normal: Vector2,
        result: number[]
    ): void {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        const len = vertices.length;

        for (let i = 0; i < len; i++) {
            // The magnitude of the projection of the point onto the normal
            const dot = vertices[i].dot(normal);

            if (dot < min) {
                min = dot;
            }
            if (dot > max) {
                max = dot;
            }
        }

        result[0] = min;
        result[1] = max;
    }

    /**
     * Check whether two convex polygons are separated by the specified
     * axis (must be a unit vector).
     *
     * @param aPos The position of the first polygon.
     * @param bPos The position of the second polygon.
     * @param aPoints The vertices in the first polygon.
     * @param bPoints The vertices in the second polygon.
     * @param axis The axis (unit sized) to test against.  The points of both polygons
     *   will be projected onto this axis.
     * @param result A SatResult object (optional) which will be populated
     *   if the axis is not a separating axis.
     * @return {boolean} true if it is a separating axis, false otherwise.  If false,
     *   and a response is passed in, information about how much overlap and
     *   the direction of the overlap will be populated.
     */
    private isSeparatingAxis(
        aPos: Vector2,
        bPos: Vector2,
        aPoints: Vector2[],
        bPoints: Vector2[],
        axis: Vector2,
        result?: SatResult
    ): boolean {
        const rangeA: number[] = this.arrayPool.get();
        const rangeB: number[] = this.arrayPool.get();

        // The magnitude of the offset between the two polygons
        const offsetV = this.vectorPool.get().copy(bPos).sub(aPos);
        const projectedOffset = offsetV.dot(axis);

        // Project the polygons onto the axis.
        SeparatingAxisTheorem.flattenVerticesOn(aPoints, axis, rangeA);
        SeparatingAxisTheorem.flattenVerticesOn(bPoints, axis, rangeB);

        // Move B's range to its position relative to A.
        rangeB[0] += projectedOffset;
        rangeB[1] += projectedOffset;

        // Check if there is a gap. If there is, this is a separating axis and we can stop
        if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
            this.vectorPool.free(offsetV);
            this.arrayPool.free(rangeA);
            this.arrayPool.free(rangeB);

            return true;
        }

        // This is not a separating axis. If we're calculating a result, calculate the overlap.
        if (result) {
            let overlap = 0;

            // A starts further left than B
            if (rangeA[0] < rangeB[0]) {
                result.aInB = false;

                // A ends before B does. We have to pull A out of B
                if (rangeA[1] < rangeB[1]) {
                    overlap = rangeA[1] - rangeB[0];
                    result.bInA = false;
                } else {
                    // B is fully inside A.  Pick the shortest way out.
                    const option1 = rangeA[1] - rangeB[0];
                    const option2 = rangeB[1] - rangeA[0];

                    overlap = option1 < option2 ? option1 : -option2;
                }
            } else {
                // B starts further left than A
                result.bInA = false;

                // B ends before A ends. We have to push A out of B
                if (rangeA[1] > rangeB[1]) {
                    overlap = rangeA[0] - rangeB[1];
                    result.aInB = false;

                    // A is fully inside B.  Pick the shortest way out.
                } else {
                    const option1 = rangeA[1] - rangeB[0];
                    const option2 = rangeB[1] - rangeA[0];

                    overlap = option1 < option2 ? option1 : -option2;
                }
            }

            // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
            const absOverlap = Math.abs(overlap);

            if (absOverlap < result.overlap) {
                result.overlap = absOverlap;
                result.overlapN.copy(axis);
                if (overlap < 0) {
                    result.overlapN.negate();
                }
            }
        }

        this.vectorPool.free(offsetV);
        this.arrayPool.free(rangeA);
        this.arrayPool.free(rangeB);

        return false;
    }

    /**
     * Check if a polygon and a circle collide.
     *
     * @param polygon
     * @param circle
     * @param response SatResult object (optional) that will be populated if they intersect.
     * @return {boolean} true if they intersect, false if they don't.
     */
    public testPolygonInCircle(
        polygon: Polygon,
        circle: Circle,
        response?: SatResult
    ): boolean {
        // Get the position of the circle relative to the polygon.
        const circlePos = this.vectorPool
            .get()
            .copy(circle.position)
            .sub(polygon.position);
        const radius = circle.radius;
        const radius2 = radius * radius;
        const points = polygon.computedVertices;
        const len = points.length;
        const edge = this.vectorPool.get();
        const point = this.vectorPool.get();

        // For each edge in the polygon:
        for (let i = 0; i < len; i++) {
            const next = i === len - 1 ? 0 : i + 1;
            const prev = i === 0 ? len - 1 : i - 1;
            let overlap = 0;
            let overlapN: Vector2 | undefined = undefined;

            // Get the edge.
            edge.copy(polygon.edges[i] as Vector2);

            // Calculate the center of the circle relative to the starting point of the edge.
            point.copy(circlePos).sub(points[i]);

            // If the distance between the center of the circle and the point
            // is bigger than the radius, the polygon is definitely not fully in
            // the circle.
            if (response && point.lengthSq() > radius2) {
                response.aInB = false;
            }

            // Calculate which Voronoi region the center of the circle is in.
            let region = VoronoiRegion.calculate(edge, point);

            // If it's the left region:
            if (region === VoronoiRegion.LEFT_VORONOI_REGION) {
                // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
                edge.copy(polygon.edges[prev]);

                // Calculate the center of the circle relative the starting point of the previous edge
                const point2 = this.vectorPool
                    .get()
                    .copy(circlePos)
                    .sub(points[prev]);

                region = VoronoiRegion.calculate(edge, point2);

                if (region === VoronoiRegion.RIGHT_VORONOI_REGION) {
                    // It's in the region we want.  Check if the circle intersects the point.
                    const dist = point.length();

                    if (dist > radius) {
                        // No intersection
                        this.vectorPool.free(circlePos);
                        this.vectorPool.free(edge);
                        this.vectorPool.free(point);
                        this.vectorPool.free(point2);

                        return false;
                    } else if (response) {
                        // It intersects, calculate the overlap.
                        response.bInA = false;
                        overlapN = point.normalize();
                        overlap = radius - dist;
                    }
                }

                this.vectorPool.free(point2);

                // If it's the right region:
            } else if (region === VoronoiRegion.RIGHT_VORONOI_REGION) {
                // We need to make sure we're in the left region on the next edge
                edge.copy(polygon.edges[next]);

                // Calculate the center of the circle relative to the starting point of the next edge.
                point.copy(circlePos).sub(points[next]);
                region = VoronoiRegion.calculate(edge, point);
                if (region === VoronoiRegion.LEFT_VORONOI_REGION) {
                    // It's in the region we want.  Check if the circle intersects the point.
                    const dist = point.length();

                    if (dist > radius) {
                        // No intersection
                        this.vectorPool.free(circlePos);
                        this.vectorPool.free(edge);
                        this.vectorPool.free(point);

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
                const normal = Vector2Helper.perp(edge).normalize();

                // Find the perpendicular distance between the center of the
                // circle and the edge.
                const dist = point.dot(normal);
                const distAbs = Math.abs(dist);

                // If the circle is on the outside of the edge, there is no intersection.
                if (dist > 0 && distAbs > radius) {
                    // No intersection
                    this.vectorPool.free(circlePos);
                    this.vectorPool.free(normal);
                    this.vectorPool.free(point);

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
            if (
                overlapN &&
                response &&
                Math.abs(overlap) < Math.abs(response.overlap)
            ) {
                response.overlap = overlap;
                response.overlapN.copy(overlapN);
            }
        }

        // Calculate the final overlap vector - based on the smallest overlap.
        if (response) {
            response.a = polygon;
            response.b = circle;
            response.overlapV
                .copy(response.overlapN)
                .multiplyScalar(response.overlap);
        }

        this.vectorPool.free(circlePos);
        this.vectorPool.free(edge);
        this.vectorPool.free(point);

        return true;
    }

    /**
     * Check if a circle and a polygon collide.
     *
     *   **NOTE:** This is slightly less efficient than polygonCircle as it just
     *   runs polygonCircle and reverses everything at the end.
     * @param circle
     * @param polygon
     * @param response SatResult object (optional) that will be populated if they intersect.
     * @return {boolean} true if they intersect, false if they don't.
     */
    public testCircleInPolygon(
        circle: Circle,
        polygon: Polygon,
        response?: SatResult
    ): boolean {
        // Test the polygon against the circle.
        const result = this.testPolygonInCircle(polygon, circle, response);

        if (result && response) {
            // Swap A and B in the response.
            const a = response.a;
            const aInB = response.aInB;

            response.overlapN.negate();
            response.overlapV.negate();
            response.a = response.b;
            response.b = a;
            response.aInB = response.bInA;
            response.bInA = aInB;
        }

        return result;
    }

    /**
     * Check if a point is inside a convex polygon.
     *
     * @param point
     * @param polygon
     * @return {boolean} true if the point is inside the polygon, false if it is not.
     */
    public testPointInPolygon(point: Vector2, polygon: Polygon): boolean {
        POINT_POLYGON.position.copy(point);

        this.cachedSatResult.clear();

        let result = this.testPolygonInPolygon(
            POINT_POLYGON,
            polygon,
            this.cachedSatResult
        );

        if (result) {
            result = this.cachedSatResult.aInB;
        }

        return result;
    }

    /**
     * Checks whether polygons collide.
     *
     * @param a The first polygon.
     * @param b The second polygon.
     * @param result SatResult object (optional) that will be populated if they intersect.
     * @return {boolean} true if they intersect, false if they don't.
     */
    public testPolygonInPolygon(
        a: Polygon,
        b: Polygon,
        result?: SatResult
    ): boolean {
        const aPoints = a.computedVertices;
        const aLen = aPoints.length;
        const bPoints = b.computedVertices;
        const bLen = bPoints.length;

        // If any of the edge normals of A is a separating axis, no intersection.
        for (let i = 0; i < aLen; i++) {
            if (
                this.isSeparatingAxis(
                    a.position,
                    b.position,
                    aPoints,
                    bPoints,
                    a.normals[i],
                    result
                )
            ) {
                return false;
            }
        }

        // If any of the edge normals of B is a separating axis, no intersection.
        for (let i = 0; i < bLen; i++) {
            if (
                this.isSeparatingAxis(
                    a.position,
                    b.position,
                    aPoints,
                    bPoints,
                    b.normals[i],
                    result
                )
            ) {
                return false;
            }
        }

        // Since none of the edge normals of A or B are a separating axis, there is an intersection
        // and we've already calculated the smallest overlap (in _isSeparatingAxis).  Calculate the
        // final overlap vector.
        if (result) {
            result.a = a;
            result.b = b;
            result.overlapV
                .copy(result.overlapN)
                .multiplyScalar(result.overlap);
        }

        return true;
    }

    /**
     * Check if two circles collide.
     *
     * @param a The first circle.
     * @param b The second circle.
     * @param response SatResult object (optional) that will be populated if the circles intersect.
     * @return {boolean} true if the circles intersect, false if they don't.
     */
    public testCircleInCircle(
        a: Circle,
        b: Circle,
        response?: SatResult
    ): boolean {
        // Check if the distance between the centers of the two
        // circles is greater than their combined radius.
        const differenceV = this.vectorPool
            .get()
            .copy(b.position)
            .sub(a.position);
        const totalRadius = a.radius + b.radius;
        const totalRadiusSq = totalRadius * totalRadius;
        const distanceSq = differenceV.lengthSq();

        // If the distance is bigger than the combined radius, they don't intersect.
        if (distanceSq > totalRadiusSq) {
            this.vectorPool.free(differenceV);

            return false;
        }

        // They intersect.  If we're calculating a response, calculate the overlap.
        if (response) {
            const dist = Math.sqrt(distanceSq);

            response.a = a;
            response.b = b;
            response.overlap = totalRadius - dist;
            response.overlapN.copy(differenceV.normalize());
            response.overlapV
                .copy(differenceV)
                .multiplyScalar(response.overlap);
            response.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
            response.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
        }

        this.vectorPool.free(differenceV);

        return true;
    }

    /**
     * Check if a point is inside a circle.
     * @param point The point to test.
     * @param circle The circle to test.
     * @return {boolean} true if the point is inside the circle, false if it is not.
     */
    public testPointInCircle(point: Vector2, circle: Circle): boolean {
        const differenceV = this.vectorPool
            .get()
            .copy(point)
            .sub(circle.position);
        const radiusSq = circle.radius * circle.radius;
        const distanceSq = differenceV.lengthSq();

        this.vectorPool.free(differenceV);

        // If the distance between is smaller than the radius then the point is inside the circle.
        return distanceSq <= radiusSq;
    }
}
