let Polygon = require('../utils/geometry/polygon');
let Vector2 = require('math-utils').Vector2;

class Block {
    constructor (id = null, position, width, height, depth) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.north = 'animation_water_0003';
        this.south = 'roof1_edge';
        this.west = 'grass_center';
        this.east = 'roof1_edge';
        this.top = 'roof1_edge';
        this.position = position;

        // TODO
        this.collidable = true;
        this.view = null;
    }

    get position2D () {
        return new Vector2(this.x, this.y);
    }

    get wallPolygons () {
        let polygons = [];

        if (this.south) {
            polygons.push(
                new Polygon(this.position2D, [
                    new Vector2(this.x, this.y),
                    new Vector2(this.x + this.width, this.y)
                ])
            );
        }

        if (this.north) {
            polygons.push(
                new Polygon(this.position2D, [
                    new Vector2(this.x, this.y + this.height),
                    new Vector2(this.x + this.width, this.y + this.height)
                ])
            );
        }

        if (this.east) {
            polygons.push(
                new Polygon(this.position2D, [
                    new Vector2(this.x + this.width, this.y),
                    new Vector2(this.x + this.width, this.y + this.height)
                ])
            );
        }

        if (this.west) {
            polygons.push(
                new Polygon(this.position2D, [
                    new Vector2(this.x, this.y),
                    new Vector2(this.x, this.y + this.height)
                ])
            );
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
