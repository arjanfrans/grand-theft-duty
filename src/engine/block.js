class Block {
    constructor (id = null) {
        this.id = id;
        this.north = 'animation_water_0003';
        this.south = 'roof1_edge';
        this.west = 'grass_center';
        this.east = 'roof1_edge';
        this.top = 'dirt_center';

        // TODO
        this.collidable = true;
    }
}

module.exports = Block;
