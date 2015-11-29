let debug = require('debug')('game:engine/states/play/PlayRenderView');

import RenderView from '../../../engine/graphics/RenderView';
import LightView from '../../../engine/views/LightView';

class PlayRenderView extends RenderView {
    constructor (world) {
        super();

        this.world = world;
        this.cameraFollowView = null;
        this.clearColor = 0x000000;
    }

    init () {
        super.init();

        this.camera = new THREE.PerspectiveCamera(75, this.world.width / this.world.height, 100, 1000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;

        let ambientLight = new THREE.AmbientLight(0x010101);

        for (let light of this.world.map.lights) {
            let lightView = new LightView(light);

            lightView.init();

            this.scene.add(lightView.mesh);
        }

        // this.scene.add(ambientLight);

        this.cameraFollowLight = new THREE.SpotLight(0xfffffff, 1, 400);
        this.cameraFollowLight.angle = 180 * (Math.PI / 180);
        this.cameraFollowLight.exponent = 1;
        this.cameraFollowLightTarget = new THREE.Object3D();
        this.cameraFollowLight.target = this.cameraFollowLightTarget;

        this.scene.add(this.cameraFollowLightTarget);
        this.scene.add(this.cameraFollowLight);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);

        if (this.cameraFollowView) {
            this.camera.position.setX(this.cameraFollowView.position.x);
            this.camera.position.setY(this.cameraFollowView.position.y);

            this.cameraFollowLight.position.setX(this.cameraFollowView.position.x);
            this.cameraFollowLight.position.setY(this.cameraFollowView.position.y);
            this.cameraFollowLight.position.setZ(this.cameraFollowView.position.z + 200);

            this.cameraFollowLightTarget.position.setX(this.cameraFollowView.position.x);
            this.cameraFollowLightTarget.position.setY(this.cameraFollowView.position.y);
            this.cameraFollowLightTarget.position.setZ(this.cameraFollowView.position.z);
        }
    }
}

module.exports = PlayRenderView;
