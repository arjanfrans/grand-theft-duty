import { WebGLRenderer } from 'three';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export class ThreeRenderer {
    private _views?: Set<any>;
    protected webglRenderer: WebGLRenderer;

    /**
     * @constructor
     *
     * @param {string} [divName=gameDiv] - id of the html div to render into.
     */
    constructor (divName = 'root') {
        this.webglRenderer = new WebGLRenderer();

        this.webglRenderer.setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.webglRenderer.setClearColor(0x000000);
        this.webglRenderer.setPixelRatio(window.devicePixelRatio);
        this.webglRenderer.autoClear = false;

        (document.getElementById(divName) as HTMLDivElement).appendChild(this.webglRenderer.domElement);
    }

    set views (views) {
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

            view.size = {
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT
            };

            index += 1;
        }
    }

    get views () {
        return this._views;
    }

    preRender(): void
    {

    }

    postRender(): void
    {
    }

    /**
     * Render the view
     *
     * @returns {void}
     */
    render (interpolationPercentage) {
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

            this.webglRenderer.render(view.scene, view.camera);

            index += 1;
        }
    }
}
