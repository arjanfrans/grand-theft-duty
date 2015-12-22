import RenderDebug from './utils/debug/RenderDebug';
import Renderer from './graphics/Renderer';
import MainLoop from './utils/mainloop';

class Engine {
    constructor (options = { debugMode: false }) {
        this.debugMode = options.debugMode;
        this.states = new Map();
        this.currentState = null;
        this._renderer = new Renderer();

        if (this.debugMode) {
            this._renderDebug = new RenderDebug(this._renderer);
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
        if (this.currentState.views.size > 0) {
            this._renderer.views = this.currentState.views;
        } else {
            console.warn('currentState has no View');
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
    run () {
        let render = (interpolationPercentage) => {
            this.currentState.render(interpolationPercentage);
            this._renderer.render(interpolationPercentage);
        };

        let update = (delta) => {
            if (this.currentState) {
                this.currentState.update(delta);
            } else {
                console.warn('no current State');
            }
        };

        let before = () => {
            if (this.debugMode) {
                this._renderDebug.before();
            }
        };

        let after = () => {
            if (this.debugMode) {
                this._renderDebug.after();
            }
        };

        let loop = MainLoop.setUpdate(update).setDraw(render).setBegin(before).setEnd(after);

        loop.start();
    }
}

export default Engine;
