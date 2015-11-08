let debug = require('debug')('game:engine/maps/loader');

import AssetLoader from '../asset-loader';

import Block from '../world/block';
import WorldMap from './world-map';

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

let MapLoader = {
    load: function (name) {
        let rawMap = AssetLoader.getMap(name);

        return _parseRawMap(rawMap);
    }
};

export default MapLoader;
