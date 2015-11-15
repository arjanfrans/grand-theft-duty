let debug = require('debug')('game:engine/asset-loader');

const ATLAS_DIRECTORY = '../../assets/spritesheets/';
const MAPS_DIRECTORY = '../../assets/maps/';
const FONTS_DIRECTORY = '../../assets/fonts/';

let _textureLoader = new THREE.TextureLoader();
let _xhrLoader = new THREE.XHRLoader();

let _assets = {
    atlases: new Map(),
    textures: new Map(),
    maps: new Map(),
    fonts: new Map()
};

let _loadFont = function (name) {
    let font = {
        mapping: null,
        texture: null
    };

    return _loadJson(FONTS_DIRECTORY + name + '.json').then((fontJson) => {
        font.mapping = fontJson;

        // TODO only supports 1 font page for now
        return _loadTexture(name, FONTS_DIRECTORY + fontJson.pages[0]);
    }).then(() => {
        font.texture = _assets.textures.get(name);

        _assets.fonts.set(name, font);
    });
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
    init: function (assetConfig) {
        let assetsToLoad = [];

        for (let atlasName of assetConfig.textureAtlases) {
            assetsToLoad.push(_loadAtlas(atlasName));
        }

        for (let mapName of assetConfig.maps) {
            assetsToLoad.push(_loadMap(mapName));
        }

        for (let fontName of assetConfig.fonts) {
            assetsToLoad.push(_loadFont(fontName));
        }

        return Promise.all(assetsToLoad);
    },

    getTexture (name) {
        let texture = _assets.textures.get(name);

        if (!texture) {
            throw new Error('Texture does not exist: ' + name);
        }

        return texture;
    },

    cloneTexture (name) {
        let texture = this.getTexture(name);
        let clone = texture.clone();

        clone.needsUpdate = true;

        return clone;
    },

    getMap (name) {
        let map = _assets.maps.get(name);

        if (!map) {
            throw new Error('Map does not exist: ' + name);
        }

        return map;
    },

    getAtlasMapping (name) {
        let mapping = _assets.atlases.get(name);

        if (!mapping) {
            throw new Error('Atlas mapping does not exist: ' + name);
        }

        return mapping;
    },

    getFont (name) {
        let font = _assets.fonts.get(name);

        if (!font) {
            throw new Error('Font does not exist: ' + name);
        }

        return font;
    }
};

export default AssetLoader;
