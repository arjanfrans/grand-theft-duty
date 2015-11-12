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
        this.views = new Set();
        this._initialized = false;
    }

    addView (view) {
        this.views.add(view);
    }

    update () {
        throw new TypeError('State requires update() method');
    }

    init () {
        if (!this._initialized) {
            for (let view of this.views.values()) {
                view.init();
            }

            this._initialized = true;
        }
    }
}

export default State;
