import Block from './Block';
import Light from './Light';
import WorldMap from './WorldMap';

let _parseBlock = function (rawBlock, blockWidth, blockHeight, blockDepth) {
    let position = {
        x: rawBlock.position.x * blockWidth,
        y: rawBlock.position.y * blockHeight,
        z: rawBlock.position.z * blockDepth
    };

    let blockOptions = {
        walls: rawBlock.walls,
        type: rawBlock.type,
        collidable: rawBlock.collidable
    };

    let block = new Block(position, blockWidth, blockHeight, blockDepth, blockOptions);

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

let parseLight = function (rawLight, blockWidth, blockHeight, blockDepth) {
    let rawPosition = rawLight.position;
    let sourcePosition = {
        x: rawPosition.x * blockWidth,
        y: rawPosition.y * blockHeight,
        z: rawPosition.z * blockDepth
    };

    let position = {
        x: rawPosition.x * blockWidth,
        y: rawPosition.y * blockHeight,
        z: rawPosition.z * blockDepth
    };

    let angle = Math.PI * 2;

    if (rawLight.align === 'west') {
        sourcePosition.x -= blockWidth / 2;
    } else if (rawLight.align === 'east') {
        sourcePosition.x += blockWidth / 2;
        angle = 180 * (Math.PI / 180);
    } else if (rawLight.align === 'north') {
        sourcePosition.y += blockHeight / 2;
        angle = 90 * (Math.PI / 180);
    } else if (rawLight.align === 'south') {
        sourcePosition.y -= blockHeight / 2;
        angle = 270 * (Math.PI / 180);
    }

    let light = new Light(position.x, position.y, position.z, rawLight.color);

    light.angle = angle;
    light.sourcePosition = sourcePosition;

    return light;
};

let _parseRawMap = function (rawMap) {
    // TODO validate map
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

    let worldMap = new WorldMap(layers, mapWidth, mapHeight, mapDepth, blockWidth, blockHeight, blockDepth);

    if (rawMap.lights) {
        for (let rawLight of rawMap.lights) {
            worldMap.lights.push(parseLight(rawLight, blockWidth, blockHeight, blockDepth));
        }
    }

    worldMap.name = rawMap.name;
    worldMap.respawns = [];

    for (let respawn of rawMap.respawns) {
        worldMap.respawns.push(respawn);
    }

    return worldMap;
};

let MapParser = {
    parse: function (rawMap) {
        return _parseRawMap(rawMap);
    }
};

export default MapParser;
