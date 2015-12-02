let debug = require('debug')('game:engine/views/ViewContainer');

class ViewContainer {
    constructor () {
        this.staticViews = new Set();
        this.dynamicViews = new Set();

        this._initialized = false;
    }

    init () {
        this.mesh = new THREE.Object3D();

        for (let staticView of this.staticViews) {
            staticView.init();
            this.mesh.add(staticView.mesh);
        }

        for (let view of this.dynamicViews) {
            view.init();
            this.mesh.add(view.mesh);
        }

        this._initialized = true;
    }

    update (delta) {
        if (!this._initialized) {
            throw new Error('View not initialized.');
        }

        for (let view of this.dynamicViews) {
            view.update(delta);
        }
    }

    addStaticView (staticView) {
        if (this._initialized) {
            staticView.init();
            this.mesh.add(staticView.mesh);
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
            this.mesh.add(dynamicView.mesh);
        }

        this.dynamicViews.add(dynamicView);
    }

    addDynamicViews (dynamicViews) {
        for (let dynamicView of dynamicViews) {
            this.addDynamicView(dynamicView);
        }
    }

    set visible (visible) {
        this.mesh.visible = visible;
    }

    get visible () {
        return this.mesh.visible;
    }
}

export default ViewContainer;
