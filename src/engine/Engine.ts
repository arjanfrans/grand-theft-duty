import Mainloop from "@arjanfrans/mainloop";
import { AbstractState } from "./state/AbstractState";
import { NullState } from "./state/NullState";
import { InputSourceInterface } from "./input/InputSourceInterface";
import { RendererInterface } from "./renderer/RendererInterface";

export interface EngineOptions {
    renderer: RendererInterface;
    input: { [key: string]: InputSourceInterface };
}

export class Engine {
    private states: Map<string, AbstractState> = new Map();
    private currentState: AbstractState;
    private readonly renderer: RendererInterface;
    public readonly inputSources: Map<string, InputSourceInterface> = new Map();

    constructor(options: EngineOptions) {
        this.currentState = new NullState(this);
        this.renderer = options.renderer;

        for (const [key, inputSource] of Object.entries(options.input)) {
            this.inputSources.set(key, inputSource);
        }
    }

    /**
     * Add a State to the engine.
     */
    addState(name: string, state: AbstractState): void {
        this.states.set(name, state);
    }

    /**
     * Change the current state and change the renderer's view to the view of the state.
     *
     * @param name Name of the state to change to.
     */
    changeState(name: string): void {
        const state = this.states.get(name);

        if (!state) {
            throw new Error(`State ${name} not found.`);
        }

        this.currentState = state;
        this.currentState.init();

        this.renderer.handleStateChange(this.currentState);
    }

    /**
     * Remove a state from the engine.
     *
     * @param name Name of the state to remove.
     */
    removeState(name: string): void {
        this.states.delete(name);
    }

    /**
     * The game loop. Updates the current state and renders it's Views.
     */
    run(): void {
        const render = (interpolationPercentage) => {
            this.currentState.render(interpolationPercentage);
            this.renderer.render(interpolationPercentage);
        };

        const update = (delta) => {
            if (this.currentState) {
                this.currentState.update(delta);
            } else {
                console.warn("no current State");
            }
        };

        const before = () => {
            this.renderer.preRender();
        };

        const after = () => {
            this.renderer.postRender();
        };

        const loop = new Mainloop();

        loop.setUpdate(update);
        loop.setDraw(render);
        loop.setBegin(before);
        loop.setEnd(after);

        loop.start();
    }
}
