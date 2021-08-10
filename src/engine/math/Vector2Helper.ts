import {Vector2} from "three";

export class Vector2Helper {
    private constructor() {
    }

    public static perp(v: Vector2): Vector2 {
        const x = v.x;

        v.x = v.y;
        v.y = -x;

        return v;
    }
}
