import path from 'path';
import fs from 'fs';

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

let maps = new Map();

let ServerAssetManager = {
    init (assetConfig = ASSET_CONFIG) {
        for (let mapName of assetConfig.maps) {
            try {
                let map = JSON.parse(fs.readFileSync(assetConfig.paths.maps + mapName + '.json'));

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

export default ServerAssetManager;
