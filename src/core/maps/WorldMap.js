import {Vector3} from "three";

class WorldMap {
    constructor (layers, width, height, depth, blockWidth, blockHeight, blockDepth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.blockDepth = blockDepth;

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
        return this.width * this.blockWidth;
    }

    get totalHeight () {
        return this.height * this.blockHeight;
    }

    get totalDepth () {
        return this.depth * this.blockDepth;
    }

    indexToPosition (index) {
        return {
            x: index.x * this.blockWidth,
            y: index.y * this.blockHeight,
            z: index.z * this.blockDepth
        };
    }

    positionToIndex (position) {
        const x = position.x;
        const y = position.y;
        const z = position.z;

        const index = {};

        index.x = Math.floor(x / this.blockWidth);
        index.y = Math.floor(y / this.blockHeight);
        index.z = Math.floor(z / this.blockDepth);

        return index;
    }

    randomRespawnPosition () {
        const respawn = this.respawns[Math.round(Math.random() * (this.respawns.length - 1))];
        const position = this.indexToPosition(respawn.position);

        return new Vector3(position.x, position.y, position.z);
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
        const indexes = this.positionToIndex(position);

        return this.blockAtIndex(indexes);
    }

    blocksAtPositions (positions, types = []) {
        const blocks = [];

        for (const position of positions) {
            const block = this.blockAtPosition(position);

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
        const blocks = [];

        const min = start;
        const max = end;

        for (let z = 0; z < this.layers.length; z++) {
            if ((z >= min.z && z <= max.z)) {
                for (let y = 0; y < this.layers[z].length; y++) {
                    if ((y >= min.y && y <= max.y)) {
                        for (let x = 0; x < this.layers[z][y].length; x++) {
                            if ((x >= min.x && x <= max.x)) {
                                const index = { x, y, z };

                                const block = this.blockAtIndex(index);

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

        for (const layer of this.layers) {
            const layerStrings = [];

            for (const layerRow of layer) {
                const blocks = layerRow.map(v => v ? v.id : 0);

                layerStrings.push(blocks.join(', '));
            }

            finalString = finalString.concat(layerStrings.join('\n'));
            finalString = finalString.concat('\n---------------\n');
        }

        return finalString;
    }
}

export default WorldMap;
