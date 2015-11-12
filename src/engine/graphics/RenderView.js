let debug = require('debug')('game:engine/graphics/render-view');

class RenderView {
    constructor () {
        this.width = 800;
        this.height = 600;

        this.staticViews = new Set();
        this.dynamicViews = new Set();

        this._initialized = false;

        this.camera = null;
    }

    init () {
        this.scene = new THREE.Scene();

        for (let staticView of this.staticViews) {
            staticView.init();
            this.scene.add(staticView.mesh);
        }

        for (let view of this.dynamicViews) {
            view.init();
            this.scene.add(view.mesh);
        }
    }

    update (delta) {
        if (!this._initialized) {
            throw new Error('View not initialized.');
        }

        for (let view of this.dynamicViews) {
            view.update(delta);
        }
    }

    set size (size) {
        this.width = size.width;
        this.height = size.height;

        if (this.camera) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }
    }

    addStaticView (staticView) {
        if (this._initialized) {
            staticView.init();
            this.scene.add(staticView.mesh);
        }

        this.staticViews.add(staticView);
    }

    addStaticViews (staticViews) {
        for (let staticView of staticViews) {
            this.addStaticView(staticView);
        }
    }

    addDynamicView (dynamicView) {
        if (this._initialized) {
            dynamicView.init();
            this.scene.add(dynamicView.mesh);
        }

        this.dynamicViews.add(dynamicView);
    }

    addDynamicViews (dynamicViews) {
        for (let dynamicView of dynamicViews) {
            this.addDynamicView(dynamicView);
        }
    }
}

export default RenderView;
