import Engine from '../engine/Engine';
import AssetManager from '../engine/AssetManager';
import path from 'path';

import MenuBuilder from './menu/MenuBuilder';

const ASSET_PATH = path.resolve(__dirname, '../../assets/');
const ASSET_CONFIG = {
    paths: {
        maps: ASSET_PATH + '/maps',
        atlases: ASSET_PATH + '/spritesheets',
        fonts: ASSET_PATH + '/fonts',
        audio: ASSET_PATH + '/audio/sprites'
    },
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

let Game = {

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

            let menuState = MenuBuilder.create(engine);

            engine.addState('menu', menuState);

            engine.changeState('menu');

            engine.run();
        }).catch(function (err) {
            throw err;
        });
    }
};

module.exports = Game;