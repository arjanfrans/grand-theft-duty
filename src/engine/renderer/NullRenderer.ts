import { RendererInterface } from "./RendererInterface";
import { AbstractState } from "../state/AbstractState";

export class NullRenderer implements RendererInterface {
    handleStateChange(state: AbstractState): void {}

    postRender(): void {}

    preRender(): void {}

    render(interpolationPercentage: number): void {}
}
