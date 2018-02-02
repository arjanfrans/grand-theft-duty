import Mainloop from "@arjanfrans/mainloop";

abstract class AbstractEngine {
    // private states: Map<any> = new Map<any>();
    private loop: Mainloop;

    constructor(
        simulationTimestep: number,
        maxFps: number,
    ) {
        this.loop = new Mainloop();

        this.loop.setSimulationTimestep(simulationTimestep);
        this.loop.setMaxAllowedFPS(maxFps);
    }

    public start(): void {
        this.loop.setDraw(this.render);
        this.loop.setUpdate(this.update);
        this.loop.setBegin(this.before);
        this.loop.setEnd(this.after);

        this.loop.start();
    }

    protected abstract before(timestamp: number, delta: number): void;

    protected abstract after(fps: number, panic: boolean): void;

    protected abstract render(interpolation: number): void;

    protected abstract update(delta: number): void;
}

export default AbstractEngine;
