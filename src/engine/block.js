
class Block {
    constructor (id = null) {
        this.id = id;
        this.north = null;
        this.south = null;
        this.west = null;
        this.east = null;
        this.top = null;

        // TODO
        this.collidable = true;
    }
}

module.exports = Block;
