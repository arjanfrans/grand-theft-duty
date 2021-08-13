import {AbstractState} from "../state/AbstractState";

export interface RendererInterface {
    render(interpolationPercentage: number): void;

    preRender(): void;

    postRender(): void;

    handleStateChange(state: AbstractState): void;
}
