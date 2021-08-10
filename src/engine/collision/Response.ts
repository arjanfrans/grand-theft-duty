// ## Response
//
// An object representing the result of an intersection. Contains:
//  - The two objects participating in the intersection
//  - The vector representing the minimum change necessary to extract the first object
//    from the second one (as well as a unit vector in that direction and the magnitude
//    of the overlap)
//  - Whether the first object is entirely inside the second, and vice versa.
import {Vector2} from "three";

class Response {
    public a?: any;
    public b?: any;
    public overlapN: Vector2;
    public overlapV: Vector2;
    public aInB: boolean = true;
    public bInA: boolean = true;
    public overlap?: number;

    constructor () {
        this.a = null;
        this.b = null;
        this.overlapN = new Vector2();
        this.overlapV = new Vector2();

        this.clear();
    }

    /**
     * Set some values of the response back to their defaults.  Call this between tests if
     * you are going to reuse a single Response object for multiple intersection tests (recommented
     * as it will avoid allcating extra memory)
     *
     * @return {Response} This for chaining
     */
    clear () {
        this.aInB = true;
        this.bInA = true;
        this.overlap = Number.MAX_VALUE;

        return this;
    }
}

export default Response;
