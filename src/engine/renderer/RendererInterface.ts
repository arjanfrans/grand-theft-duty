import { AbstractState } from "../../client/AbstractState";

export interface RendererInterface {
    render(interpolationPercentage: number): void;

    preRender(): void;

    postRender(): void;

    handleStateChange(state: AbstractState): void;
}
