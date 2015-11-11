let debug = require('debug')('game:engine/engine');

import RenderDebug from './debug/render-debug';
import Renderer from './graphics/renderer';

let clock = new THREE.Clock();

class Engine {
    constructor (options = { debugMode: false }) {
        this.debugMode = options.debugMode;
        this.states = new Map();
        this.currentState = null;
        this._renderer = new Renderer('webgl');

        if (this.debugMode) {
            this._renderDebug = new RenderDebug(this._renderer._THREErenderer);
            this._renderDebug.init();
        }
    }

    /**
     * Add a State to the engine.
     *
     * @param {string} name - Name of the state.
     * @param {State} state - Instance of the state.
     *
     * @returns {void}
     */
    addState (name, state) {
        this.states.set(name, state);
    }

    /**
     * Change the current state and change the renderer's view to the view of the state.
     *
     * @param {string} name - Name of the state to change to.
     *
     * @returns {void}
     */
    changeState (name) {
        this.currentState = this.states.get(name);
        this.currentState.init();
        if (this.currentState.view) {
            this._renderer.view = this.currentState.view;
        } else {
            debug('currentState has no View');
        }
    }

    /**
     * Remove a state from the engine.
     *
     * @param {string} name - Name of the state to remove.
     *
     * @returns {void}
     */
    removeState (name) {
        this.states.delete(name);
    }

    /**
     * The game loop. Updates the current state and renders it's Views.
     *
     * @returns {void}
     */
    update () {
        let loop = () => {
            let delta = clock.getDelta();

            if (this.debugMode) {
                this._renderDebug.before();
            }

            // Tell browser to perform animation.
            window.requestAnimationFrame(loop);

            if (this.currentState) {
                this.currentState.update(delta);
                this._renderer.render(delta);
            } else {
                debug('no current State');
            }

            if (this.debugMode) {
                this._renderDebug.after();
            }
        };

        loop();
    }
}

export default Engine;
