import {MeshLambertMaterial, Object3D, Vector3} from 'three';
import {View} from "./View";

export class ViewContainer {
    private staticViews: Set<View>;
    private dynamicViews: Set<View>
    private _backgroundView?: View = undefined
    private _width: number;
    private _height: number;
    private _initialized: boolean = false;
    private mesh: Object3D = new Object3D();

    constructor () {
        this.staticViews = new Set();
        this.dynamicViews = new Set();
        this._width = 800;
        this._height = 600;
    }

    init () {
        const backgroundView = this._backgroundView;

        if (backgroundView) {
            const mesh = backgroundView.getMesh();

            backgroundView.init();
            // mesh.width = this._width;
            // mesh.height = this._height;
            mesh.renderOrder = -1;
            this.mesh.add(mesh);
        }

        for (const staticView of this.staticViews) {
            staticView.init();
            this.mesh.add(staticView.getMesh());
        }

        for (const view of this.dynamicViews) {
            view.init();
            this.mesh.add(view.getMesh());
        }

        this._initialized = true;
    }

    set backgroundView (backgroundView) {
        if (backgroundView !== this._backgroundView) {
            if (this._initialized) {
                backgroundView.init();
                backgroundView.width = this._width;
                backgroundView.height = this._height;
                backgroundView.mesh.renderOrder = -1;

                this.mesh.remove(backgroundView.getMesh());
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
            // view.update(delta);
        }
    }

    addStaticView (staticView, position?: Vector3) {
        if (this._initialized) {
            staticView.init();
            this.mesh.add(staticView.mesh);
        }

        if (position) {
            staticView.position = { x: position.x, y: position.y, z: position.z };
        }

        this.staticViews.add(staticView);
    }

    addDynamicView (dynamicView, position?: Vector3) {
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
            // this._backgroundView.width = this._width;
        }

        this.mesh.scale.x = scale;
        this.mesh.updateMatrix();
        this.mesh.updateMatrixWorld(true)
    }

    set height (height) {
        const scale = height / this._height;

        this._height = height;

        if (this._backgroundView) {
            // this._backgroundView.height = this._height;
        }

        this.mesh.scale.y = scale;
        this.mesh.updateMatrix();
        this.mesh.updateMatrixWorld(true)
    }
}
