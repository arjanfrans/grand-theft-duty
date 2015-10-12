let debug = require('debug')('game:engine/engine');

let Renderer = require('./renderer');

let renderer = new Renderer('webgl');
let states = new Map();
let currentState = null;

/**
 * The game loop. Updates the current state and renders it's Views.
 *
 * @returns {void}
 */
let _update = function () {
    // Tell browser to perform animation.
    window.requestAnimationFrame(_update);

    if (currentState) {
        currentState.update();
        renderer.render();
    } else {
        debug('no current State');
    }
};

module.exports = {

    /**
     * Add a State to the engine.
     *
     * @param {string} name - Name of the state.
     * @param {State} state - Instance of the state.
     *
     * @returns {void}
     */
    addState (name, state) {
        states.set(name, state);
    },

    /**
     * Change the current state.
     *
     * @param {string} name - Name of the state to change to.
     *
     * @returns {void}
     */
    changeState (name) {
        currentState = states.get(name);
        renderer.view = currentState.view;
    },

    /**
     * Remove a state from the engine.
     *
     * @param {string} name - Name of the state to remove.
     *
     * @returns {void}
     */
    removeState (name) {
        states.delete(name);
    },

    /**
     * Call game loop.
     *
     * @returns {void}
     */
    update: _update
};
