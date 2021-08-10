import { RendererInterface } from "./RendererInterface";
import { State } from "../../client/State";

export class NullRenderer implements RendererInterface {
    handleStateChange(state: State): void {}

    postRender(): void {}

    preRender(): void {}

    render(interpolationPercentage: number): void {}
}
