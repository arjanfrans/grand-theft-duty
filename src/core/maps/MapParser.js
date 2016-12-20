import Block from './Block';
import Light from './Light';
import WorldMap from './WorldMap';

const _parseBlock = function (rawBlock, blockWidth, blockHeight, blockDepth) {
    const position = {
        x: rawBlock.position.x * blockWidth,
        y: rawBlock.position.y * blockHeight,
        z: rawBlock.position.z * blockDepth
    };

    const blockOptions = {
        walls: rawBlock.walls,
        type: rawBlock.type,
        collidable: rawBlock.collidable
    };

    const block = new Block(position, blockWidth, blockHeight, blockDepth, blockOptions);

    block.collidable = rawBlock.collidable || false;

    return block;
};

const _createEmptyLayers = function (mapWidth, mapHeight, mapDepth) {
    const layers = [];

    for (let z = 0; z < mapDepth; z++) {
        const layer = [];

        for (let y = 0; y < mapHeight; y++) {
            const row = [];

            for (let x = 0; x < mapDepth; x++) {
                row.push(null);
            }

            layer.push(row);
        }

        layers.push(layer);
    }

    return layers;
};

const parseLight = function (rawLight, blockWidth, blockHeight, blockDepth) {
    const rawPosition = rawLight.position;
    const sourcePosition = {
        x: rawPosition.x * blockWidth,
        y: rawPosition.y * blockHeight,
        z: rawPosition.z * blockDepth
    };

    const position = {
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

    const light = new Light(position.x, position.y, position.z, rawLight.color);

    light.angle = angle;
    light.sourcePosition = sourcePosition;

    return light;
};

const _parseRawMap = function (rawMap) {
    // TODO validate map
    const rawBlocks = rawMap.blocks;

    const blockWidth = rawMap.blockWidth;
    const blockHeight = rawMap.blockHeight;
    const blockDepth = rawMap.blockDepth;

    const mapWidth = rawMap.width;
    const mapHeight = rawMap.height;
    const mapDepth = rawMap.depth;

    const layers = _createEmptyLayers(mapWidth, mapHeight, mapDepth);

    for (const rawBlock of rawBlocks) {
        const block = _parseBlock(rawBlock, blockWidth, blockHeight, blockDepth);

        const position = rawBlock.position;

        // TODO check for out of bounds
        layers[position.z][position.y][position.x] = block;
    }

    const worldMap = new WorldMap(layers, mapWidth, mapHeight, mapDepth, blockWidth, blockHeight, blockDepth);

    if (rawMap.lights) {
        for (const rawLight of rawMap.lights) {
            worldMap.lights.push(parseLight(rawLight, blockWidth, blockHeight, blockDepth));
        }
    }

    worldMap.name = rawMap.name;
    worldMap.respawns = [];

    for (const respawn of rawMap.respawns) {
        worldMap.respawns.push(respawn);
    }

    return worldMap;
};

const MapParser = {
    parse: function (rawMap) {
        return _parseRawMap(rawMap);
    }
};

export default MapParser;
