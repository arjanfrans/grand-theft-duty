import AbstractEngine from "./AbstractEngine";
import IRenderer from "./IRenderer";
import IState from "./IState";

class Engine extends AbstractEngine {
    private states: Map<string, IState> = new Map<string, IState>();
    private statePriorities: Map<IState, number> = new Map<IState, number>();
    private activeStates: IState[] = [];
    private renderer: IRenderer;

    constructor(
        simulationTimestep: number,
        maxFps: number,
        renderer: IRenderer,
    ) {
        super(simulationTimestep, maxFps);
        this.renderer = renderer;
    }

    public addState(
        id: string,
        state: IState,
        active: boolean,
        priority: number,
    ): void {
        this.states.set(id, state);
        this.statePriorities.set(state, priority);

        if (active) {
            this.activeStates.push(state);

            this.activeStates = this.sortActiveStates();
        }
    }

    public removeState(id: string): void {
        const state = this.states.get(id);

        this.statePriorities.delete(state);
        this.removeActiveState(state);
    }

    protected render(interpolation: number): void {
        this.renderer.before();

        for (const state of this.activeStates) {
            state.render(interpolation);
            this.renderer.renderState(state);
        }

        this.renderer.after();
    }

    protected update(delta: number): void {
        for (const state of this.activeStates) {
            state.update(delta);
        }
    }

    protected before(timestamp: number, delta: number): void {
        for (const state of this.activeStates) {
            state.before(timestamp, delta);
        }
    }

    protected after(fps: number, panic: boolean): void {
        for (const state of this.activeStates) {
            state.after(fps, panic);
        }
    }

    private removeActiveState(state: IState): void {
        this.activeStates = this.activeStates.filter((activeState: IState) => {
            return state !== state;
        });
    }

    private sortActiveStates(): IState[] {
        return this.activeStates.sort((a: IState, b: IState): number => {
            const aPriority = this.statePriorities.get(a);
            const bPriority = this.statePriorities.get(b);

            if (aPriority > bPriority) {
                return -1;
            } else if (bPriority > aPriority) {
                return 1;
            }

            return 0;
        });
    }
}

export default Engine;
