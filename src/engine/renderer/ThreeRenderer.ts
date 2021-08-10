import { WebGLRenderer } from "three";
import { RendererInterface } from "./RendererInterface";
import { State } from "../../client/State";
import { ThreeRenderView } from "./render-view/ThreeRenderView";

export interface ThreeRendererOptions {
    /**
     * id of the html div to render into.
     */
    div: string;

    width: number;
    height: number;
}

export class ThreeRenderer implements RendererInterface {
    private _views?: Set<ThreeRenderView>;
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

    set views(views) {
        this._views = views;

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

    handleStateChange(state: State): void {
        const views = state.views;

        if (views.size > 0) {
            this.views = views;
        }
    }

    get views() {
        return this._views;
    }

    preRender(): void {}

    postRender(): void {}

    render(interpolationPercentage: number): void {
        this.webglRenderer.clear();

        let index = 0;

        const views = this._views;

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
