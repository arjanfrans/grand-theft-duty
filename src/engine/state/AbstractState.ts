import { Engine } from "../Engine";
import {SceneInterface} from "../renderer/render-view/SceneInterface";

export abstract class AbstractState {
    protected readonly name: string;
    protected readonly engine: Engine;
    public readonly scenes: Set<SceneInterface>;
    protected _initialized = false;

    protected constructor(name: string, engine: Engine) {
        this.name = name;
        this.engine = engine;
        this.scenes = new Set();
    }

    public addScene(scene: SceneInterface): void {
        this.scenes.add(scene);
    }

    public abstract update(delta: number): void;

    init() {
        if (!this._initialized) {
            for (const scene of this.scenes.values()) {
                scene.init();
            }

            this._initialized = true;
        }
    }

    render(delta) {
        for (const scene of this.scenes.values()) {
            scene.update(delta);
        }
    }
}
