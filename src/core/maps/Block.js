import {Polygon} from '../../engine/collision/Polygon';
import {Vector2} from "three";

class Block {
    constructor (position, width, height, depth, options = {}) {
        this._position = position;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.options = options;
        this.type = options.type || 'wall';
        this._walls = options.walls || {};
        this.collidable = options.collidable || true;

        this._computeBodies();
    }

    set walls (walls) {
        this._walls = walls;
        this._computeBodies();
    }

    get walls () {
        return this._walls;
    }

    set position (position) {
        this._position = position;
        this._computeBodies();
    }

    get position () {
        return this._position;
    }

    _computeBodies () {
         // If fully closed block (nothing should be inside it)
        if (this._walls.top && this._walls.west && this._walls.east && this._walls.south && this._walls.north) {
            this.bodies = [
                new Polygon(new Vector2(this.x, this.y), [
                    new Vector2(0, 0),
                    new Vector2(this.width, 0),
                    new Vector2(this.width, this.height),
                    new Vector2(0, this.height)
                ])
            ];
        }

        const bodies = [];

        if (this._walls.west) {
            bodies.push(new Polygon(new Vector2(this.x, this.y), [
                new Vector2(0, 0),
                new Vector2(this.width, 0),
                new Vector2(this.width, 2),
                new Vector2(0, 2)
            ]));
        }

        if (this._walls.east) {
            bodies.push(new Polygon(new Vector2(this.x, this.y + this.height), [
                new Vector2(0, 0),
                new Vector2(this.width, 0),
                new Vector2(this.width, -2),
                new Vector2(0, -2)
            ]));
        }

        if (this._walls.south) {
            bodies.push(new Polygon(new Vector2(this.x + this.width, this.y), [
                new Vector2(0, 0),
                new Vector2(0, this.height),
                new Vector2(-2, this.height),
                new Vector2(-2, 0)
            ]));
        }

        if (this._walls.north) {
            bodies.push(new Polygon(new Vector2(this.x, this.y), [
                new Vector2(0, 0),
                new Vector2(0, this.height),
                new Vector2(2, this.height),
                new Vector2(2, 0)
            ]));
        }

        this.bodies = bodies;
    }

    get x () {
        return this._position.x;
    }

    get y () {
        return this._position.y;
    }

    get z () {
        return this._position.z;
    }
}

export default Block;
