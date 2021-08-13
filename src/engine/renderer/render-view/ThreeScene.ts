import { Camera, OrthographicCamera, PerspectiveCamera, Scene } from "three";
import { SceneInterface } from "./SceneInterface";
import { Dimension } from "../../math/Dimension";

export abstract class ThreeScene implements SceneInterface {
    public width: number;
    public height: number;
    protected _initialized: boolean;
    public clearColor: number;
    public viewContainers: Map<any, any>;
    public currentViewContainerName?: string;
    public _currentViewContainer?: any;
    private _scene?: Scene;

    protected constructor() {
        this.width = 0;
        this.height = 0;

        this._initialized = false;
        this.clearColor = 0x000000;
        this.viewContainers = new Map();
        this.currentViewContainer = null;
    }

    public abstract getCamera():
        | Camera
        | OrthographicCamera
        | PerspectiveCamera;

    init() {
        this._scene = new Scene();

        for (let [name, viewContainer] of this.viewContainers.entries()) {
            viewContainer.init();
            viewContainer.width = this.width;
            viewContainer.height = this.height;

            this._scene.add(viewContainer.mesh);

            if (name === this.currentViewContainerName) {
                viewContainer.visible = true;
                this._currentViewContainer = viewContainer;
            } else {
                viewContainer.visible = false;
            }
        }
    }

    get scene(): Scene {
        const scene = this._scene;

        if (!scene) {
            throw new Error("Scene is undefined");
        }

        return scene;
    }

    update(delta) {
        if (this._currentViewContainer) {
            this._currentViewContainer.update(delta);
        } else {
            console.warn("no current ViewContainer");
        }
    }

    changeSize(size: Dimension): void {
        this.width = size.width;
        this.height = size.height;

        this.init();
    }

    set currentViewContainer(name) {
        const newViewContainer = this.viewContainers.get(name);

        if (this._initialized) {
            if (this._currentViewContainer) {
                this._currentViewContainer.visible = false;
            }

            newViewContainer.visible = true;
        }

        this.currentViewContainerName = name;
        this._currentViewContainer = newViewContainer;
    }

    get currentViewContainer() {
        return this._currentViewContainer;
    }

    addViewContainer(name, viewContainer) {
        if (this._initialized) {
            viewContainer.init();
            viewContainer.width = this.width;
            viewContainer.height = this.height;

            this.scene.add(viewContainer.mesh);
        }
        this.viewContainers.set(name, viewContainer);
    }
}
