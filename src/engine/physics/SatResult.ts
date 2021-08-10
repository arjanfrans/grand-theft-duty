import {Vector2} from "three";
import {Polygon} from "../math/Polygon";
import {Box} from "../math/Box";
import {Circle} from "../math/Circle";

/**
 *
 * An object representing the result of an intersection. Contains:
 *  - The two objects participating in the intersection
 *  - The vector representing the minimum change necessary to extract the first object
 *    from the second one (as well as a unit vector in that direction and the magnitude
 *    of the overlap)
 *  - Whether the first object is entirely inside the second, and vice versa.
 */
export class SatResult {
    public a?: Polygon|Circle|Box = undefined;
    public b?: Polygon|Circle|Box = undefined;
    public overlapN: Vector2 = new Vector2();
    public overlapV: Vector2 = new Vector2();
    public aInB: boolean = true;
    public bInA: boolean = true;
    public overlap: number = Number.MAX_VALUE;

    constructor () {
        this.clear();
    }

    /**
     * Set some values of the response back to their defaults.  Call this between tests if
     * you are going to reuse a single SatResult object for multiple intersection tests (recommended
     * as it will avoid allcating extra memory)
     */
    clear (): SatResult {
        this.aInB = true;
        this.bInA = true;
        this.overlap = Number.MAX_VALUE;

        return this;
    }
}
