let Map = require('../map');

class World {
    constructor (map, width = 5, height = 5, depth = 5) {
        this.width = width;
        this.height = height;

        this.map = map;
        this.player = null;
        this.physics = null;
    }

    update (delta) {
        if (this.player) {
            this.player.update(delta);
        }

        if (this.physics) {
            this.physics.update(delta);
        }
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
