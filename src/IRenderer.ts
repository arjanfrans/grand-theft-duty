import IState from "./IState";

interface IRenderer {
    before(): void;
    after(): void;
    renderState(state: IState): void;
}

export default IRenderer;
