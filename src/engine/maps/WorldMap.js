class WorldMap {
    constructor (layers, width, height, depth, tileWidth, tileHeight, tileDepth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileDepth = tileDepth;

        this.lights = [];
        this.layers = layers;
        this.name = null;
    }

    blocks (types) {
        return this.blocksBetweenIndexes({
            x: 0, y: 0, z: 0
        }, {
            x: this.width - 1,
            y: this.height - 1,
            z: this.depth - 1
        }, types);
    }

    get totalWidth () {
        return this.width * this.tileWidth;
    }

    get totalHeight () {
        return this.height * this.tileHeight;
    }

    get totalDepth () {
        return this.depth * this.tileDepth;
    }

    indexToPosition (index) {
        return {
            x: index.x * this.tileWidth,
            y: index.y * this.tileHeight,
            z: index.z * this.tileDepth
        };
    }

    positionToIndex (position) {
        let x = position.x;
        let y = position.y;
        let z = position.z;

        let index = {};

        index.x = Math.floor(x / this.tileWidth);
        index.y = Math.floor(y / this.tileHeight);
        index.z = Math.floor(z / this.tileDepth);

        return index;
    }

    randomRespawnPosition () {
        let respawn = this.respawns[Math.round(Math.random() * (this.respawns.length - 1))];
        let position = this.indexToPosition(respawn.position);

        return position;
    }

    blockAtIndex (index) {
        if (index.z < 0 || index.z >= this.depth) {
            return null;
        }

        if (index.y < 0 || index.y >= this.height) {
            return null;
        }

        if (index.x < 0 || index.x >= this.width) {
            return null;
        }

        return this.layers[index.z][index.y][index.x];
    }

    blockAtPosition (position) {
        let indexes = this.positionToIndex(position);

        return this.blockAtIndex(indexes);
    }

    blocksAtPositions (positions, types = []) {
        let blocks = [];

        for (let position of positions) {
            let block = this.blockAtPosition(position);

            if (block && types.indexOf(block.type) !== -1) {
                blocks.push(block);
            }
        }

        return blocks;
    }

    /**
     * Get all blocks within two index positions in the map.
     *
     * @param {object} start - contains x, y, z index positions for start.
     * @param {object} end - contains x, y, z index positions for end.
     *
     * @returns {array} All blocks within the box
     */
    blocksBetweenIndexes (start = { x: 0, y: 0, z: 0 }, end = { x: 0, y: 0, z: 0 }, types = []) {
        let blocks = [];

        let min = start;
        let max = end;

        for (let z = 0; z < this.layers.length; z++) {
            if ((z >= min.z && z <= max.z)) {
                for (let y = 0; y < this.layers[z].length; y++) {
                    if ((y >= min.y && y <= max.y)) {
                        for (let x = 0; x < this.layers[z][y].length; x++) {
                            if ((x >= min.x && x <= max.x)) {
                                let index = { x, y, z };

                                let block = this.blockAtIndex(index);

                                if (block && types.indexOf(block.type) !== -1) {
                                    blocks.push(block);
                                }
                            }
                        }
                    }
                }
            }
        }

        return blocks;
    }

    blocksBetweenPositions (start = { x: 0, y: 0, z: 0 }, end = { x: 0, y: 0, z: 0 }, types) {
        return this.blocksBetweenIndexes(this.positionToIndex(start), this.positionToIndex(end), types);
    }

    toString () {
        let finalString = '';

        for (let layer of this.layers) {
            let layerStrings = [];

            for (let layerRow of layer) {
                let tiles = layerRow.map(v => v ? v.id : 0);

                layerStrings.push(tiles.join(', '));
            }

            finalString = finalString.concat(layerStrings.join('\n'));
            finalString = finalString.concat('\n---------------\n');
        }

        return finalString;
    }
}

export default WorldMap;
