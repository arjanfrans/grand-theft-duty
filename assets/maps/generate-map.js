'use strict';

let fs = require('fs');

let width = 20;
let height = 20;
let depth = 10;
let surroundWater = 2;

let blocks = [];

let createBlock = function (x, y, z, type) {
    let block = {
        collidable: true,
        position: {
            x: x,
            y: y,
            z: z
        }
    };

    if (type === 'water') {
        block.type = 'water';
        block.walls = {
            top: 'animation_water_0001'
        };
    } else {
        block.type = 'wall';
        block.walls = {
            top: 'grass_center',
            north: 'dirt_center',
            south: 'roof1_corner',
            west: 'roof1_edge',
            east: 'grass_center'
        };

        if (x > 5 && x < 10 && y > 2 && y < 6) {
            block.walls.top = 'dirt_center';
        }

        if (Math.random() < 0.5) {
            block.walls.north = 'roof1_edge';
        }

        if (Math.random() < 0.5) {
            block.walls.west = 'roof1_edge';
        }
    }

    return block;
};

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        for (let z = 0; z < depth; z++) {
            if (z === 0) {
                if (x < surroundWater || x >= width - surroundWater) {
                    blocks.push(createBlock(x, y, z, 'water'));
                } else if (y < surroundWater || y >= height - surroundWater) {
                    blocks.push(createBlock(x, y, z, 'water'));
                }
            } else if (z === 1) {
                if (x >= surroundWater && x < width - surroundWater &&
                        y >= surroundWater && y < height - surroundWater) {
                    blocks.push(createBlock(x, y, z, 'wall'));
                }
            } else if (z === 2) {
                if (x > 5 && x <= 10 && y > 5 && y <= 10) {
                    blocks.push(createBlock(x, y, z, 'wall'));
                }
            }
        }
    }
}

blocks.push({
    position: {
        x: 3,
        y: 3,
        z: 2
    },
    type: 'wall',
    walls: {
        top: 'roof1_edge',
        south: 'roof1_corner',
        north: 'roof1_corner'
    },
    collidable: true
});

let respawns = [
    {
        position: {
            x: 5,
            y: 5,
            z: 6
        }
    },
    {
        position: {
            x: 13,
            y: 13,
            z: 6
        }
    }
];

let map = {
    name: 'level2',
    width: width,
    height: height,
    depth: depth,
    blockWidth: 100,
    blockHeight: 100,
    blockDepth: 100,
    respawns: respawns,
    blocks: blocks
};

fs.writeFileSync('./level2.json', JSON.stringify(map));
