const ATLAS_DIRECTORY = '../../assets/spritesheets/';

const TEXTURE_ATLASES = [
    'dude',
    'tiles'
];

let _textureLoader = new THREE.TextureLoader();

let _assets = {
    atlases: new Map(),
    textures: new Map(),
    maps: new Map()
};

let _loadAtlases = function () {
    // TODO load as json, and async
    _assets.atlases.set('dude', require('../../assets/spritesheets/dude.js'));
    _assets.atlases.set('tiles', require('../../assets/spritesheets/tiles.js'));
};

let _loadMaps = function () {
    // TODO load json async
    _assets.maps.set('level1', require('../../assets/maps/level1.js'));
};

let _loaded = false;

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

module.exports = {
    init: function () {
        _loadAtlases();
        _loadMaps();

        let texturesToLoad = [];

        for (let [atlasTextureName, atlas] of _assets.atlases.entries()) {
            texturesToLoad.push(_loadTexture(atlasTextureName, ATLAS_DIRECTORY + atlas.meta.image));
        }

        return Promise.all(texturesToLoad);
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
