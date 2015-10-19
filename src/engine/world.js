let Map = require('../map');

class World {
    constructor (width = 5, height = 5, depth = 5) {
        this.width = width;
        this.height = height;

        this.map = new Map(width, height, 100, 100, 100);
    }

    get tileWidth () {
        return this.map.tileWidth;
    }

    get tileHeight () {
        return this.map.tileHeight;
    }

    get tileDepth () {
        return this.map.tileDepth;
    }

    get mapLayers () {
        return this.map.layers;
    }
}

module.exports = World;
