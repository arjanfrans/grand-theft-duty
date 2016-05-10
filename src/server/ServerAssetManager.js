'use strict';

const path = require('path');
const fs = require('fs');

const ASSET_PATH = path.resolve(__dirname, '../../assets/');
const ASSET_CONFIG = {
    paths: {
        maps: ASSET_PATH + '/maps/'
    },
    maps: [
        'level1',
        'level2'
    ]
};

const maps = new Map();

const ServerAssetManager = {
    init (assetConfig = ASSET_CONFIG) {
        for (const mapName of assetConfig.maps) {
            try {
                const map = JSON.parse(fs.readFileSync(assetConfig.paths.maps + mapName + '.json'));

                maps.set(mapName, map);
            } catch (err) {
                throw err;
            }
        }
    },

    getMap (name) {
        return maps.get(name);
    }
};

module.exports = ServerAssetManager;
