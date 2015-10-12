let engine = require('./engine/engine');
let PlayState = require('./states/play');

module.exports = {
    start () {
        let playState = new PlayState();

        engine.addState('play', playState);
        engine.changeState('play');

        engine.update();
    }
};
