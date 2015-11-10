let debug = require('debug')('game:engine/state');

let i = 0;

class World {
    constructor (map, width = 5, height = 5, depth = 5) {
        this.width = width;
        this.height = height;

        this.map = map;
        this.player = null;
        this.physics = null;
        this.bulletSystem = null;
        this.enemies = null;
    }

    update (delta) {
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        if (this.physics) {
            this.physics.update(delta);
        }

        if (this.player) {
            this.player.update(delta);
        }

        for (let enemy of this.enemies) {
            enemy.update(delta);
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
