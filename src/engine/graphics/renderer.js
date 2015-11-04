'use strict';

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
        this._view = null;

        if (rendererType === 'webgl') {
            this._THREErenderer = new THREE.WebGLRenderer();
        } else {
            this._THREErenderer = new THREE.CanvasRenderer();
        }

        this._THREErenderer.setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this._THREErenderer.setClearColor(0xbfd1e5);
        this._THREErenderer.setPixelRatio(window.devicePixelRatio);

        document.getElementById(divName).appendChild(this._THREErenderer.domElement);
    }

    /**
     * Set the view that should be rendered.
     *
     * @param {View} view - view to render.
     *
     * @returns {void}
     */
    set view (view) {
        this._view = view;
        this._THREErenderer.setSize(view.width, view.height);
    }

    /**
     * Get the view that is being rendered.
     *
     * @returns {View} View that is being rendererd.
     */
    get view () {
        return this._view;
    }

    /**
     * Render the view
     *
     * @returns {void}
     */
    render () {
        if (this.view) {
            this._THREErenderer.render(this.view.scene, this.view.camera);
        } else {
            debug('Renderer has no View');
        }
    }
}

module.exports = Renderer;
