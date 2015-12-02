let debug = require('debug')('game:engine/graphics/render-view');

class RenderView {
    constructor () {
        this.width = 800;
        this.height = 600;
        this._initialized = false;
        this.clearColor = 0x000000;
        this.viewContainers = new Map();
        this._currentViewContainer = null;
        this.currentViewContainerName = null;
        this.camera = null;
    }

    init () {
        this.scene = new THREE.Scene();

        for (let viewContainer of this.viewContainers.values()) {
            viewContainer.init();

            this.scene.add(viewContainer.mesh);

            if (viewContainer === this.currentViewContainer) {
                viewContainer.visible = true;
            } else {
                viewContainer.visible = false;
            }
        }
    }

    update (delta) {
        if (this.currentViewContainer) {
            this.currentViewContainer.update(delta);
        } else {
            debug('no current ViewContainer');
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

    set currentViewContainer (name) {
        let newViewContainer = this.viewContainers.get(name);

        if (this._initialized) {
            if (this._currentViewContainer) {
                this._currentViewContainer.visible = false;
            }

            newViewContainer.visible = true;
        }

        this.currentViewContainerName = name;
        this._currentViewContainer = newViewContainer;
    }

    get currentViewContainer () {
        return this._currentViewContainer;
    }

    addViewContainer (name, viewContainer) {
        if (this._initialized) {
            viewContainer.init();

            this.scene.add(viewContainer.mesh);
        }

        this.viewContainers.set(name, viewContainer);
    }
}

export default RenderView;
