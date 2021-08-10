import {Vector2} from "three";

/**
 * Calculates which Voronoi region a point is on a line segment.
 * It is assumed that both the line and the point are relative to `(0,0)`
 *
 *            |       (0)      |
 *     (-1)  [S]--------------[E]  (1)
 *            |       (0)      |
 */
export class VoronoiRegion {
    // Constants for Voronoi regions
    public static LEFT_VORONOI_REGION = -1;
    public static MIDDLE_VORONOI_REGION = 0;
    public static RIGHT_VORONOI_REGION = 1;

    private constructor() {
    }

    /**
     * @param line The line segment.
     * @param point The point.
     * @return {number} LEFT_VORONOI_REGION (-1) if it is the left region,
     *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
     *          RIGHT_VORONOI_REGION (1) if it is the right region.
     */
    public static calculate(line: Vector2, point: Vector2): number {
        const len2 = line.lengthSq();
        const dp = point.dot(line);

        // If the point is beyond the start of the line, it is in the
        // left voronoi region.
        if (dp < 0) {
            return VoronoiRegion.LEFT_VORONOI_REGION;
        } else if (dp > len2) {
            // If the point is beyond the end of the line, it is in the
            // right voronoi region.

            return VoronoiRegion.RIGHT_VORONOI_REGION;
        } else {
            // Otherwise, it's in the middle one.
            return VoronoiRegion.MIDDLE_VORONOI_REGION;
        }
    }
}
