import { Dimension } from "../../math/Dimension";

export interface SceneInterface {
    init(): void;

    update(delta: number): void;

    changeSize(size: Dimension): void;
}
