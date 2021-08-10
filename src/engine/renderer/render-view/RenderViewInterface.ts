import { Dimension } from "../../math/Dimension";

export interface RenderViewInterface {
    update(delta: number): void;

    changeSize(size: Dimension): void;
}
