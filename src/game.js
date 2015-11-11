let debug = require('debug')('game:game');

import Engine from './engine/engine';

let stateBuilder = require('./builders/state');

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

            let playState = stateBuilder.playState();

            engine.addState('play', playState);
            engine.changeState('play');

            engine.update();
        }).catch(function (err) {
            throw err;
        });
    }
};
