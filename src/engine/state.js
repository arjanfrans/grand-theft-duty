let debug = require('debug')('game:engine/state');

/**
 * Base class for all states.
 *
 * @class
 */
class State {

    /**
     * @constructor
     *
     * @param {string} name - name of the state.
     */
    constructor (name) {
        this.name = name;
        this.inputs = new Map();
        this.view = null;
        this.initialized = false;
    }

    update () {
        throw new TypeError('State requires update() method');
    }

    init () {
        if (!this.initialized) {
            if (this.view) {
                this.view.init();
            }

            this.initialized = true;
        }
    }
}

module.exports = State;
