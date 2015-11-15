let debug = require('debug')('game:game');

import Engine from './engine/engine';

import StateBuilder from './builders/StateBuilder';

import assetLoader from './engine/asset-loader';

module.exports = {

    /**
     * Start the game.
     *
     * @returns {void}
     */
    start () {
        assetLoader.init().then(function () {
            let engine = new Engine({
                debugMode: true
            });

            // let playState = StateBuilder.PlayState.create();
            let menuState = StateBuilder.MenuState.create();

            engine.addState('menu', menuState);
            // engine.addState('play', playState);

            // engine.changeState('play');
            engine.changeState('menu');

            engine.update();
        }).catch(function (err) {
            throw err;
        });
    }
};
