let debug = require('debug')('game:engine/graphics/renderer');

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
    constructor (divName = 'gameDiv') {
        this._views = null;

        this._THREErenderer = new THREE.WebGLRenderer();

        this._THREErenderer.setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this._THREErenderer.setClearColor(0x000000);
        this._THREErenderer.setPixelRatio(window.devicePixelRatio);
        this._THREErenderer.autoClear = false;

        document.getElementById(divName).appendChild(this._THREErenderer.domElement);
    }

    set views (views) {
        this._views = views;

        let index = 0;

        for (let view of this._views) {
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
    render () {
        this._THREErenderer.clear();

        let index = 0;

        for (let view of this._views) {
            if (index > 0) {
                this._THREErenderer.clearDepth();
            }

            this._THREErenderer.render(view.scene, view.camera);

            index += 1;
        }
    }
}

export default Renderer;
