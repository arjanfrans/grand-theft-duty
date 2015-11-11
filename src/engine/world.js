let debug = require('debug')('game:engine/state');

class World {
    constructor (map, width = 5, height = 5, depth = 5) {
        this.width = width;
        this.height = height;

        this.map = map;
        this.entities = new Set();
        this.characters = new Set();
        this.enemies = new Set();
        this.player = null;
    }

    update (delta) {
        for (let entity of this.entities) {
            entity.update(delta);
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
