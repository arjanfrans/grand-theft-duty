import RenderDebug from './utils/debug/RenderDebug';
import Renderer from './graphics/Renderer';
import Mainloop from '@arjanfrans/mainloop';
import {State} from "../client/State";
import {NullState} from "./state/NullState";
import {InputSourceInterface} from "./input/InputSourceInterface";

class Engine {
    private readonly debugMode: boolean;
    private states: Map<string, State> = new Map();
    private currentState: State;
    private readonly renderer: Renderer;
    private renderDebug?: RenderDebug;
    public readonly inputSources: Map<string, InputSourceInterface> = new Map()

    constructor (debugMode: boolean, inputSources: { [key: string]: InputSourceInterface}) {
        this.debugMode = debugMode;
        this.currentState = new NullState(this);
        this.renderer = new Renderer();

        for(const [key, inputSource] of Object.entries(inputSources)) {
            this.inputSources.set(key, inputSource);
        }

        if (this.debugMode) {
            this.renderDebug = new RenderDebug(this.renderer);
            this.renderDebug.init();
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
        const state = this.states.get(name);

        if (!state) {
            throw new Error(`State ${name} not found.`);
        }

        this.currentState = state;
        this.currentState.init();

        if (this.currentState.views.size > 0) {
            this.renderer.views = this.currentState.views;
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
        const renderDebug = this.renderDebug;

        const render = (interpolationPercentage) => {
            this.currentState.render(interpolationPercentage);
            this.renderer.render(interpolationPercentage);
        };

        const update = (delta) => {
            if (this.currentState) {
                this.currentState.update(delta);
            } else {
                console.warn('no current State');
            }
        };

        const before = () => {
            if (renderDebug) {
                renderDebug.before();
            }
        };

        const after = () => {
            if (renderDebug) {
                renderDebug.after();
            }
        };

        const loop = new Mainloop();

        loop.setUpdate(update);
        loop.setDraw(render);

        if (this.renderDebug) {
            loop.setBegin(before);
            loop.setEnd(after);
        }

        loop.start();
    }
}

export default Engine;
