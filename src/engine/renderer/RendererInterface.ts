import { State } from "../../client/State";

export interface RendererInterface {
    render(interpolationPercentage: number): void;

    preRender(): void;

    postRender(): void;

    handleStateChange(state: State): void;
}
