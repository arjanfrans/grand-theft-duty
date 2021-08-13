import { WebGLRenderer } from "three";
import { RendererInterface } from "./RendererInterface";
import { ThreeScene } from "./render-view/ThreeScene";
import {AbstractState} from "../state/AbstractState";

export interface ThreeRendererOptions {
    /**
     * id of the html div to render into.
     */
    div: string;

    width: number;
    height: number;
}

export class ThreeRenderer implements RendererInterface {
    private _scenes?: Set<ThreeScene>;
    protected webglRenderer: WebGLRenderer;

    constructor(private options: ThreeRendererOptions) {
        this.webglRenderer = new WebGLRenderer();

        this.webglRenderer.setSize(options.width, options.height);
        this.webglRenderer.setClearColor(0x000000);
        this.webglRenderer.setPixelRatio(window.devicePixelRatio);
        this.webglRenderer.autoClear = false;

        (document.getElementById(options.div) as HTMLDivElement).appendChild(
            this.webglRenderer.domElement
        );
    }

    set scenes(views) {
        this._scenes = views;

        if (!views) {
            return;
        }

        let index = 0;

        for (const view of views) {
            if (index === 0) {
                // Get the clear color from the first view
                this.webglRenderer.setClearColor(view.clearColor);
            }

            view.changeSize({
                width: this.options.width,
                height: this.options.height,
            });

            index += 1;
        }
    }

    handleStateChange(state: AbstractState): void {
        const scenes = state.scenes as Set<ThreeScene>;

        if (scenes.size > 0) {
            this.scenes = scenes;
        }
    }

    get scenes() {
        return this._scenes;
    }

    preRender(): void {}

    postRender(): void {}

    render(interpolationPercentage: number): void {
        this.webglRenderer.clear();

        let index = 0;

        const views = this._scenes;

        if (!views) {
            return;
        }

        for (const view of views) {
            if (index > 0) {
                this.webglRenderer.clearDepth();
            }

            this.webglRenderer.render(view.scene, view.getCamera());

            index += 1;
        }
    }
}
