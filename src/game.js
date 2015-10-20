let engine = require('./engine/engine');
let PlayState = require('./states/play');

let stateBuilder = require('./builders/state');

module.exports = {
    start () {
        let playState = stateBuilder.playState();

        engine.addState('play', playState);
        engine.changeState('play');

        engine.update();
    }
};
