let debug = require('debug')('game:engine/asset-loader');

const ATLAS_DIRECTORY = '../../assets/spritesheets/';
const MAPS_DIRECTORY = '../../assets/maps/';

const TEXTURE_ATLASES = [
    'dude',
    'tiles'
];

const MAPS = [
    'level1'
];

let _textureLoader = new THREE.TextureLoader();
let _xhrLoader = new THREE.XHRLoader();

let _assets = {
    atlases: new Map(),
    textures: new Map(),
    maps: new Map()
};

let _loadTexture = function (name, url) {
    return new Promise(function (resolve, reject) {
        _textureLoader.load(url, function (texture) {
            _assets.textures.set(name, texture);

            return resolve();
        }, function (progress) {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        }, function (err) {
            return reject(err);
        });
    });
};

let _loadXhr = function (url) {
    return new Promise(function (resolve, reject) {
        _xhrLoader.load(url, function (response) {
            return resolve(response);
        }, function (progress) {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        }, function (err) {
            return reject(err);
        });
    });
};

let _loadJson = function (url) {
    return _loadXhr(url).then(function (response) {
        try {
            return JSON.parse(response);
        } catch (err) {
            throw err;
        }
    });
};

let _loadAtlas = function (name) {
    return _loadJson(ATLAS_DIRECTORY + name + '.json').then(function (atlas) {
        return atlas;
    }).then(function (atlas) {
        _assets.atlases.set(name, atlas);
        return _loadTexture(name, ATLAS_DIRECTORY + atlas.meta.image);
    });
};

let _loadMap = function (name) {
    return _loadJson(MAPS_DIRECTORY + name + '.json').then(function (atlas) {
        _assets.maps.set(name, atlas);
    });
};

let AssetLoader = {
    init: function () {
        let assetsToLoad = [];

        for (let atlasName of TEXTURE_ATLASES) {
            assetsToLoad.push(_loadAtlas(atlasName));
        }

        for (let mapName of MAPS) {
            assetsToLoad.push(_loadMap(mapName));
        }

        return Promise.all(assetsToLoad);
    },

    getAtlasTexture (name) {
        return _assets.textures.get(name);
    },

    cloneAtlasTexture (name) {
        let texture = _assets.textures.get(name);

        if (texture) {
            let clone = texture.clone();

            clone.needsUpdate = true;

            return clone;
        } else {
            return null;
        }
    },

    getMap (name) {
        return _assets.maps.get(name);
    },

    getAtlasMapping (name) {
        return _assets.atlases.get(name);
    }
};

export default AssetLoader;
