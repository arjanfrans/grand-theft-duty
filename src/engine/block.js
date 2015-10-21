let Bodies = require('matter-js').Bodies;

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
}

module.exports = Block;
