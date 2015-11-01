let Polygon = require('./sat/Polygon');
let Vector = require('./sat/Vector');

class Block {
    constructor (id = null, position, width, height, depth) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.west = 'animation_water_0003';
        this.east = 'roof1_edge';
        this.south = 'grass_center';
        this.north = 'roof1_edge';
        // this.top = 'roof1_edge';
        this.position = position;

        // TODO
        this.collidable = true;
        this.view = null;
    }

    get wallPolygons () {
        // If fully closed block (nothing should be inside it)
        if (this.top && this.west && this.east && this.south && this.north) {
            return [
                new Polygon(new Vector(this.x, this.y), [
                    new Vector(0, 0),
                    new Vector(this.width, 0),
                    new Vector(this.width, this.height),
                    new Vector(0, this.height)
                ])
            ];
        }

        let polygons = [];

        if (this.west) {
            polygons.push(new Polygon(new Vector(this.x, this.y), [
                new Vector(0, 0),
                new Vector(this.width, 0),
                // new Vector(this.width, 0.1),
                // new Vector(0, 0.1)
            ]));
        }

        if (this.east) {
            polygons.push(new Polygon(new Vector(this.x, this.y + this.height), [
                new Vector(0, 0),
                new Vector(this.width, 0),
                // new Vector(this.width, 0.1),
                // new Vector(0, 0.1)
            ]));
        }

        if (this.south) {
            polygons.push(new Polygon(new Vector(this.x + this.width, this.y), [
                new Vector(0, 0),
                new Vector(0, this.height),
                // new Vector(-0.1, this.height),
                // new Vector(-0.1, 0)
            ]));
        }

        if (this.north) {
            polygons.push(new Polygon(new Vector(this.x, this.y), [
                new Vector(0, 0),
                new Vector(0, this.height),
                // new Vector(-0.1, this.height),
                // new Vector(-0.1, 0)
            ]));
        }

        return polygons;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }
}

module.exports = Block;
