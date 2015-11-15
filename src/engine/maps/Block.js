let debug = require('debug')('game:engine/maps/block');

import Polygon from '../collision/Polygon';
import Vector from '../collision/Vector';

class Block {
    constructor (position, width, height, depth, walls = {}) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this._walls = walls;
        this._position = position;

        // TODO give this as a param
        this.collidable = true;

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
                new Polygon(new Vector(this.x, this.y), [
                    new Vector(0, 0),
                    new Vector(this.width, 0),
                    new Vector(this.width, this.height),
                    new Vector(0, this.height)
                ])
            ];
        }

        let bodies = [];

        if (this._walls.west) {
            bodies.push(new Polygon(new Vector(this.x, this.y), [
                new Vector(0, 0),
                new Vector(this.width, 0),
                new Vector(this.width, 1),
                new Vector(0, 1)
            ]));
        }

        if (this._walls.east) {
            bodies.push(new Polygon(new Vector(this.x, this.y + this.height), [
                new Vector(0, 0),
                new Vector(this.width, 0),
                new Vector(this.width, 1),
                new Vector(0, 1)
            ]));
        }

        if (this._walls.south) {
            bodies.push(new Polygon(new Vector(this.x + this.width, this.y), [
                new Vector(0, 0),
                new Vector(0, this.height),
                new Vector(-1, this.height),
                new Vector(-1, 0)
            ]));
        }

        if (this._walls.north) {
            bodies.push(new Polygon(new Vector(this.x, this.y), [
                new Vector(0, 0),
                new Vector(0, this.height),
                new Vector(-1, this.height),
                new Vector(-1, 0)
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
}

export default Block;
