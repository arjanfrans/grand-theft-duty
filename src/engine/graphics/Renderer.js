import { WebGLRenderer } from 'three';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

/**
 * Handles all the rendering. Uses the three.js renderer internally.
 *
 * @class
 */
class Renderer {

    /**
     * @constructor
     *
     * @param {string} [divName=gameDiv] - id of the html div to render into.
     */
    constructor (divName = 'root') {
        this._views = null;

        this._THREErenderer = new WebGLRenderer();

        this._THREErenderer.setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this._THREErenderer.setClearColor(0x000000);
        this._THREErenderer.setPixelRatio(window.devicePixelRatio);
        this._THREErenderer.autoClear = false;

        document.getElementById(divName).appendChild(this._THREErenderer.domElement);
    }

    set views (views) {
        this._views = views;

        let index = 0;

        for (const view of this._views) {
            if (index === 0) {
                // Get the clear color from the first view
                this._THREErenderer.setClearColor(view.clearColor);
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

    /**
     * Render the view
     *
     * @returns {void}
     */
    render (interpolationPercentage) {
        this._THREErenderer.clear();

        const info = {
            memory: {
                programs: 0,
                geometries: 0,
                textures: 0
            },
            render: {
                calls: 0,
                vertices: 0,
                faces: 0,
                points: 0
            }
        };

        let index = 0;

        for (const view of this._views) {
            if (index > 0) {
                this._THREErenderer.clearDepth();
            }

            this._THREErenderer.render(view.scene, view.camera);

            info.memory.programs += this._THREErenderer.info.programs.length;
            info.memory.geometries += this._THREErenderer.info.memory.geometries;
            info.memory.textures += this._THREErenderer.info.memory.textures;
            info.render.calls += this._THREErenderer.info.render.calls;
            info.render.vertices += this._THREErenderer.info.render.vertices;
            info.render.faces += this._THREErenderer.info.render.faces;
            info.render.points += this._THREErenderer.info.render.points;

            index += 1;
        }

        this.info = info;
    }
}

export default Renderer;
