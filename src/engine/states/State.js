let debug = require('debug')('game:engine/states/State');

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
        this.audio = null;
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
            if (this.audio) {
                this.audio.init();
            }

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

    render (delta) {
        for (let view of this.views.values()) {
            view.update(delta);
        }
    }

    updateAudio (delta) {
        if (this.audio) {
            this.audio.update(delta);
        }
    }
}

export default State;
