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
     * @param {string} [renderType=webgl] - three.js renderer to use.
     * @param {string} [divName=gameDiv] - id of the html div to render into.
     */
    constructor (rendererType = 'webgl', divName = 'gameDiv') {
        this._backView = null;
        this._frontView = null;

        if (rendererType === 'webgl') {
            this._THREErenderer = new THREE.WebGLRenderer();
        } else {
            this._THREErenderer = new THREE.CanvasRenderer();
        }

        this._THREErenderer.setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this._THREErenderer.setClearColor(0xbfd1e5);
        this._THREErenderer.setPixelRatio(window.devicePixelRatio);
        this._THREErenderer.autoClear = false;

        document.getElementById(divName).appendChild(this._THREErenderer.domElement);
    }

    set backView (backView) {
        this._backView = backView;

        this._backView.size = {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT
        };

        this._THREErenderer.setSize(backView.width, backView.height);
    }

    get backView () {
        return this._backView;
    }

    set frontView (frontView) {
        this._frontView = frontView;

        this._frontView.size = {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT
        };

        this._THREErenderer.setSize(frontView.width, frontView.height);
    }

    get frontView () {
        return this._frontView;
    }

    /**
     * Render the view
     *
     * @returns {void}
     */
    render () {
        this._THREErenderer.clear();

        if (this.backView) {
            this._THREErenderer.render(this.backView.scene, this.backView.camera);
        }

        if (this.frontView) {
            this._THREErenderer.clearDepth();
            this._THREErenderer.render(this.frontView.scene, this.frontView.camera);
        }
    }
}

export default Renderer;
