import { Object3D } from 'three';

class ViewContainer {
    constructor () {
        this.staticViews = new Set();
        this.dynamicViews = new Set();
        this._backgroundView = null;
        this._width = 800;
        this._height = 600;

        this._initialized = false;
    }

    init () {
        this.mesh = new Object3D();

        if (this._backgroundView) {
            this._backgroundView.init();
            this._backgroundView.width = this._width;
            this._backgroundView.height = this._height;
            this._backgroundView.mesh.renderOrder = -1;
            this.mesh.add(this._backgroundView.mesh);
        }

        for (const staticView of this.staticViews) {
            staticView.init();
            this.mesh.add(staticView.mesh);
        }

        for (const view of this.dynamicViews) {
            view.init();
            this.mesh.add(view.mesh);
        }

        this._initialized = true;
    }

    set backgroundView (backgroundView) {
        if (backgroundView !== this._backgroundView) {
            if (this._initialized) {
                this._backgroundView.init();
                this._backgroundView.width = this._width;
                this._backgroundView.height = this._height;
                this._backgroundView.mesh.renderOrder = -1;
                this.mesh.remove(this._backgroundView);
            }

            this._backgroundView = backgroundView;
        } else {
            console.warn('backgroundView is the same');
        }
    }

    update (delta) {
        if (!this._initialized) {
            throw new Error('View not initialized.');
        }

        for (const view of this.dynamicViews) {
            view.update(delta);
        }
    }

    addStaticView (staticView, position) {
        if (this._initialized) {
            staticView.init();
            this.mesh.add(staticView.mesh);
        }

        if (position) {
            staticView.position = { x: position.x, y: position.y, z: position.z };
        }

        this.staticViews.add(staticView);
    }

    addDynamicView (dynamicView, position) {
        if (this._initialized) {
            dynamicView.init();
            this.mesh.add(dynamicView.mesh);
        }

        if (position) {
            dynamicView.position = { x: position.x, y: position.y, z: position.z };
        }

        this.dynamicViews.add(dynamicView);
    }

    set visible (visible) {
        this.mesh.visible = visible;
    }

    get visible () {
        return this.mesh.visible;
    }

    set width (width) {
        const scale = width / this._width;

        this._width = width;

        if (this._backgroundView) {
            this._backgroundView.width = this._width;
        }

        this.mesh.scale.x = scale;
    }

    set height (height) {
        const scale = height / this._height;

        this._height = height;

        if (this._backgroundView) {
            this._backgroundView.height = this._height;
        }

        this.mesh.scale.y = scale;
    }
}

export default ViewContainer;
