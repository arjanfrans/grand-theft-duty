let debug = require('debug')('game:engine/states/play/play-view');

import StateView from '../state-view';

class PlayStateView extends StateView {
    constructor (world) {
        super();

        this.world = world;

        this.staticViews = new Set();
        this.dynamicViews = new Set();
        this.uiViews = new Set();
        this._initialized = false;

        this.camera = new THREE.PerspectiveCamera(75, this.world.width / this.world.height, 1, 100000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        this.cameraFollowView = null;
    }

    init () {
        super.init();

        for (let view of this.uiViews) {
            view.init();
            this.scene.add(view.mesh);
        }

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        this._initialized = true;
    }

    addUIView (view) {
        this.uiViews.add(view);

        view.stickToCamera(this.camera);

        if (this._initialized) {
            view.init();
        }
    }

    update (delta) {
        super.update(delta);

        if (this.cameraFollowView) {
            this.camera.position.setX(this.cameraFollowView.position.x);
            this.camera.position.setY(this.cameraFollowView.position.y);
        }

        // TODO only update whene necessary
        for (let uiView of this.uiViews) {
            uiView.update();
            console.log(uiView.mesh);
        }
    }
}

module.exports = PlayStateView;
