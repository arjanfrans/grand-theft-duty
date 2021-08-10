/**
 * Base class for all states.
 *
 * @class
 */
import Engine from "../engine/Engine";
import { StateInput } from "../engine/state/StateInput";

export abstract class State {
    protected readonly name: string;
    protected readonly engine: Engine;
    protected audio?: any;
    protected inputs: Set<StateInput>;
    public readonly views: Set<any>;
    protected _initialized = false;

    protected constructor(name: string, engine: Engine) {
        this.name = name;
        this.engine = engine;
        this.inputs = new Set();
        this.views = new Set();
        this.audio = undefined;
    }

    public addView(view: any): void {
        this.views.add(view);
    }

    public addInput(input: any): void {
        this.inputs.add(input);
    }

    public abstract update(delta: number);

    init() {
        if (!this._initialized) {
            if (this.audio) {
                this.audio.init();
            }

            for (const view of this.views.values()) {
                view.init();
            }

            this._initialized = true;
        }
    }

    updateInputs(delta) {
        for (const input of this.inputs.values()) {
            input.update(delta);
        }
    }

    render(delta) {
        for (const view of this.views.values()) {
            view.update(delta);
        }
    }

    updateAudio(delta) {
        if (this.audio) {
            this.audio.update(delta);
        }
    }
}
