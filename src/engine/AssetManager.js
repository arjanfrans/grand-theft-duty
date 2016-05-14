import Howler from 'howler';

let _assets = {
    atlases: new Map(),
    textures: new Map(),
    maps: new Map(),
    fonts: new Map(),
    audio: new Map()
};

let _loadHowlerAudio = function (name, spriteJson) {
    return new Promise((resolve, reject) => {
        spriteJson.onload = function () {
            return resolve();
        };

        spriteJson.onloaderror = function (soundId, err) {
            return reject(err);
        };

        let sound = new Howler.Howl(spriteJson);

        let audio = {
            mapping: spriteJson,
            sound: sound
        };

        _assets.audio.set(name, audio);
    });
};

let _loadAudioSprite = function (audioSpritePath, name) {
    return _loadJson(audioSpritePath + name + '.json').then(function (spriteJson) {
        // FIXME change "urls" to "src" to work with Howler 2
        spriteJson.src = spriteJson.urls;

        let fullSources = [];

        for (let src of spriteJson.src) {
            fullSources.push(audioSpritePath + src);
        }

        spriteJson.src = fullSources;

        return _loadHowlerAudio(name, spriteJson);
    });
};

let _loadFont = function (fontsPath, name) {
    let font = {
        mapping: null,
        pages: [],
        textures: []
    };

    return _loadJson(fontsPath + name + '.json').then((fontJson) => {
        font.mapping = fontJson;

        let pageTextures = fontJson.pages.map((pageName) => {
            font.pages.push(pageName);

            return _loadTexture(pageName, fontsPath + pageName);
        });

        return Promise.all(pageTextures);
    }).then(() => {
        for (let page of font.pages) {
            font.textures.push(_assets.textures.get(page));
        }

        _assets.fonts.set(name, font);
    });
};

let _loadTexture = function (name, url) {
    return new Promise(function (resolve, reject) {
        _textureLoader.load(url, function (texture) {
            _assets.textures.set(name, texture);

            return resolve();
        }, function (progress) {
            // console.log((progress.loaded / progress.total * 100) + '% loaded');
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
            // console.log((progress.loaded / progress.total * 100) + '% loaded');
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

let _loadAtlas = function (atlasesPath, name) {
    return _loadJson(atlasesPath + name + '.json').then(function (atlas) {
        return atlas;
    }).then(function (atlas) {
        _assets.atlases.set(name, atlas);
        return _loadTexture(name, atlasesPath + atlas.meta.image);
    });
};

let _loadMap = function (mapsPath, name) {
    return _loadJson(mapsPath + name + '.json').then(function (atlas) {
        _assets.maps.set(name, atlas);
    });
};

let _textureLoader = null;
let _xhrLoader = null;

let AssetLoader = {
    init: function (assetConfig) {
        _textureLoader = new THREE.TextureLoader();
        _xhrLoader = new THREE.XHRLoader();

        let assetsToLoad = [];
        let paths = assetConfig.paths;

        for (let atlasName of assetConfig.textureAtlases) {
            assetsToLoad.push(_loadAtlas(paths.atlases + '/', atlasName));
        }

        for (let mapName of assetConfig.maps) {
            assetsToLoad.push(_loadMap(paths.maps + '/', mapName));
        }

        for (let fontName of assetConfig.fonts) {
            assetsToLoad.push(_loadFont(paths.fonts + '/', fontName));
        }

        for (let audioSpriteName of assetConfig.audio) {
            assetsToLoad.push(_loadAudioSprite(paths.audio + '/', audioSpriteName));
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
    },

    getAudioSprite (name) {
        let audioSprite = _assets.audio.get(name);

        if (!audioSprite) {
            throw new Error('Audio sprite does not exist: ' + name);
        }

        return audioSprite;
    }
};

export default AssetLoader;
