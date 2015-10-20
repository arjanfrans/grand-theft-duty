let debug = require('debug')('game:engine/map');
let Block = require('./engine/block');

class Map {
    constructor (width, height, tileWidth, tileHeight, tileDepth) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileDepth = tileDepth;

        this.layers = [];

        let layer1 = [
            [1, 0, 0, 1, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1]
        ];

        let layer2 = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1]
        ];

        let tmpLayers = [layer1];

        this.layers = [];

        for (let z = 0; z < tmpLayers.length; z++) {
            let layer = tmpLayers[z];

            if (!this.layers[z]) {
                this.layers[z] = [];
            }

            for (let y = 0; y < layer.length; y++) {
                let row = layer[y];

                if (!this.layers[z][y]) {
                    this.layers[z][y] = [];
                }

                for (let x = 0; x < row.length; x++) {
                    if (row[x] === 0) {
                        this.layers[z][y][x] = null;
                    } else {
                        this.layers[z][y][x] = new Block(row[x], {
                            x: x * tileWidth,
                            y: y * tileHeight,
                            z: z * tileDepth
                        }, tileWidth, tileHeight, tileDepth);
                    }
                }
            }
        }
    }

    get depth () {
        return this.layers.length;
    }

    get totalWidth () {
        return this.width * this.tileWidth;
    }

    get totalHeight () {
        return this.height * this.tileHeight;
    }

    positionToIndex (position) {
        let {x, y, z} = position;

        let indexX = x > 0 ? Math.floor(x / this.tileWidth) : Math.ceil(x / this.tileWidth);
        let indexY = y > 0 ? Math.floor(y / this.tileHeight) : Math.ceil(y / this.tileHeight);
        let indexZ = z > 0 ? Math.floor(z / this.tileDepth) : Math.ceil(z / this.tileDepth);

        return {
            x: indexX,
            y: indexY,
            z: indexZ
        };
    }

    blockAtIndex (index) {
        if (index.x < 0 || index.y < 0 || index.z < 0 ||
                index.x >= this.width || index.y >= this.height ||
                index.z >= this.depth) {
            return null;
        }

        return this.layers[index.z][index.y][index.x];
    }

    blockAtPosition (position) {
        let indexes = this.positionToIndex(position);

        return this.blockAtIndex(indexes);
    }

    blocksAtPositions (positions) {
        let blocks = [];

        for (let position of positions) {
            let block = this.blockAtPosition(position);

            if (block) {
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
    blocksBetweenIndexes (start = { x: 0, y: 0, z: 0 }, end = { x: 0, y: 0, z: 0 }) {
        let blocks = [];

        for (let z = 0; z < this.layers.length; z++) {
            if ((z >= start.z && z <= end.z) || (z >= end.z && z <= start.z)) {
                for (let y = 0; y < this.layers[z].length; y++) {
                    if ((y >= start.y && y <= end.y) || (y >= end.y && y <= start.y)) {
                        for (let x = 0; x < this.layers[z][y].length; x++) {
                            if ((x >= start.x && x <= end.x) || (x >= end.x && x <= start.x)) {
                                let index = { x, y, z };

                                let block = this.blockAtIndex(index);

                                if (block) {
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

    blocksBetweenPositions (start = { x: 0, y: 0, z: 0 }, end = { x: 0, y: 0, z: 0 }) {
        return this.blocksBetweenIndexes(this.positionToIndex(start), this.positionToIndex(end));
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

module.exports = Map;
