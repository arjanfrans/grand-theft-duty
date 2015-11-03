let debug = require('debug')('game:engine/engine');

let DebugStats = require('stats.js');
const DEBUG = true;

let Renderer = require('./renderer');

let renderer = new Renderer('webgl');
let states = new Map();
let currentState = null;

let clock = new THREE.Clock();

let debugStats = null;

if (DEBUG) {
    debugStats = new DebugStats();
    debugStats.setMode(0);
    debugStats.domElement.style.position = 'absolute';
    debugStats.domElement.style.left = '0px';
    debugStats.domElement.style.top = '0px';

    document.body.appendChild(debugStats.domElement);
}

/**
 * The game loop. Updates the current state and renders it's Views.
 *
 * @returns {void}
 */
let _update = function () {
    let delta = clock.getDelta();

    if (DEBUG) {
        debugStats.begin();
    }

    // Tell browser to perform animation.
    window.requestAnimationFrame(_update);

    if (currentState) {
        currentState.update(delta);
        renderer.render(delta);
    } else {
        debug('no current State');
    }

    if (DEBUG) {
        debugStats.end();
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
        currentState.init();
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
