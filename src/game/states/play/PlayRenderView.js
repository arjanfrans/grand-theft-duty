let debug = require('debug')('game:engine/states/play/PlayRenderView');

import RenderView from '../../../engine/graphics/RenderView';

class PlayRenderView extends RenderView {
    constructor (world) {
        super();

        this.world = world;
        this.cameraFollowView = null;
    }

    init () {
        super.init();

        this.camera = new THREE.PerspectiveCamera(75, this.world.width / this.world.height, 100, 1000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);

        if (this.cameraFollowView) {
            this.camera.position.setX(this.cameraFollowView.position.x);
            this.camera.position.setY(this.cameraFollowView.position.y);
        }
    }
}

module.exports = PlayRenderView;
