import { Camera, Scene } from "three";

interface IState {
    render(interpolation: number): void;
    update(delta: number): void;
    before(timestamp: number, delta: number): void;
    after(fps: number, panic: boolean): void;
    getScene(): Scene;
    getCamera(): Camera;
}

export default IState;
