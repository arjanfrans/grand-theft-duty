let debug = require('debug')('game:engine/maps/loader');

// TODO browserify doesn't support dynamic require, so pre define here.
let _maps = new Map();

_maps.set('level1', require('../../../assets/maps/level1.js'));

let Block = require('../world/block');
let WorldMap = require('./world-map');

let _parseBlock = function (rawBlock, blockWidth, blockHeight, blockDepth) {
    let position = {
        x: rawBlock.position.x * blockWidth,
        y: rawBlock.position.y * blockHeight,
        z: rawBlock.position.z * blockDepth
    };

    let block = new Block(position, blockWidth, blockHeight, blockDepth, rawBlock.walls);

    block.collidable = rawBlock.collidable || false;

    return block;
};

let _createEmptyLayers = function (mapWidth, mapHeight, mapDepth) {
    let layers = [];

    for (let z = 0; z < mapDepth; z++) {
        let layer = [];

        for (let y = 0; y < mapHeight; y++) {
            let row = [];

            for (let x = 0; x < mapDepth; x++) {
                row.push(null);
            }

            layer.push(row);
        }

        layers.push(layer);
    }

    return layers;
};

let _parseRawMap = function (rawMap) {
    // TODO validate map
    let name = rawMap.name;
    let rawBlocks = rawMap.blocks;

    let blockWidth = rawMap.blockWidth;
    let blockHeight = rawMap.blockHeight;
    let blockDepth = rawMap.blockDepth;

    let mapWidth = rawMap.width;
    let mapHeight = rawMap.height;
    let mapDepth = rawMap.depth;

    let layers = _createEmptyLayers(mapWidth, mapHeight, mapDepth);

    for (let rawBlock of rawBlocks) {
        let block = _parseBlock(rawBlock, blockWidth, blockHeight, blockDepth);

        let position = rawBlock.position;

        // TODO check for out of bounds
        layers[position.z][position.y][position.x] = block;
    }

    return new WorldMap(layers, mapWidth, mapHeight, mapDepth, blockWidth, blockHeight, blockDepth);
};

module.exports = {
    load: function (name) {
        let rawMap = _maps.get(name);

        return _parseRawMap(rawMap);
    }
};
