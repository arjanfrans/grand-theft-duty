let debug = require('debug')('game:game');

import Engine from './engine/Engine';
import StateBuilder from './builders/StateBuilder';
import AssetManager from './engine/AssetManager';

const ASSET_CONFIG = {
    textureAtlases: [
        'soldier',
        'tiles',
        'world',
        'ui'
    ],
    maps: [
        'level1',
        'level2'
    ],
    fonts: [
        'long_shot'
    ],
    audio: [
        'guns',
        'background',
        'menu_effects'
    ]
};

module.exports = {

    /**
     * Load assets and start the game.
     *
     * @returns {void}
     */
    start () {
        AssetManager.init(ASSET_CONFIG).then(function () {
            let engine = new Engine({
                debugMode: true
            });

            let playState = StateBuilder.PlayState.create(engine);
            let menuState = StateBuilder.MenuState.create(engine);

            engine.addState('menu', menuState);
            engine.addState('play', playState);

            engine.changeState('menu');

            engine.changeState('play');

            engine.run();
        }).catch(function (err) {
            throw err;
        });
    }
};
