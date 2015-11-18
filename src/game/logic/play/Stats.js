let debug = require('debug')('game:engine/logic/play/Stats');

class Stats {
    constructor (playState) {
        this.state = playState;
        this.player = this.state.world.player;
    }
}

export default Stats;
