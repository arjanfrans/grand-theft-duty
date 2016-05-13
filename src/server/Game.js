'use strict';

const MainLoop = require('../engine/utils/mainloop');
const Network = require('./network');

class Game {
    constructor (state, options) {
        this.state = state;
        this.network = Network();
        this.localTime = 0;

        this._networkLoop = MainLoop.create();
        console.log(options)
        this._networkLoop.setSimulationTimestep(options.networkTimestep);
        this._networkLoop.setUpdate(() => {
            if (this.network) {
                this.network.sendUpdates(this.state, this.localTime);
            }
        });

        this._physicsLoop = MainLoop.create();
        this._physicsLoop.setSimulationTimestep(options.simulationTimestemp);
        this._physicsLoop.setUpdate((delta) => {
            this.state.update(delta);
        });

        this._timer = MainLoop.create().setSimulationTimestep(options.timerFrequency);
        this._timer.setUpdate((delta => {
            this.localTime += delta / 1000;
        }));
    }

    get players () {
        return this.state.match.soldiers;
    }

    addPlayer (player) {
        this.state.match.addSoldier(player);
    }

    removePlayer (player) {
        this.state.match.removeSoldier(player);
    }

    run () {
        this._timer.start();
        this._physicsLoop.start();
        this._networkLoop.start();
    }

    stop () {
        this._timer.stop();
        this._physicsLoop.stop();
        this._networkLoop.stop();
    }
}

module.exports = Game;
