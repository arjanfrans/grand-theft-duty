let debug = require('debug')('game:engine/states/state');

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
        this._initialized = false;
    }

    update () {
        throw new TypeError('State requires update() method');
    }

    init () {
        if (!this._initialized) {
            if (this.view) {
                this.view.init();
            }

            this._initialized = true;
        }
    }
}

export default State;
