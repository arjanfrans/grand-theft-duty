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
     * @param {Engine} engine - game engine instance.
     */
    constructor (name, engine) {
        this.name = name;
        this.engine = engine;
        this.inputs = new Set();
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

    updateInputs () {
        for (let input of this.inputs.values()) {
            input.update();
        }
    }

    updateView (delta) {
        for (let view of this.views.values()) {
            view.update(delta);
        }
    }

}

export default State;
