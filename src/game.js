let engine = require('./engine/engine');
let stateBuilder = require('./builders/state');
let assetLoader = require('./engine/asset-loader');

module.exports = {
    start () {
        assetLoader.init().then(function () {
            let playState = stateBuilder.playState();

            engine.addState('play', playState);
            engine.changeState('play');

            engine.update();
        }).catch(function (err) {
            console.error(err.stack);
            throw err;
        });
    }
};
