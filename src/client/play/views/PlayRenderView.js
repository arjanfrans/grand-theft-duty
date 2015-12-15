import RenderView from '../../../engine/graphics/RenderView';

class PlayRenderView extends RenderView {
    constructor (state) {
        super();

        this.state = state;
        this.map = this.state.map;

        this.cameraFollowView = null;
        this.clearColor = 0x000000;
    }

    init () {
        super.init();

        this.camera = new THREE.PerspectiveCamera(75, this.map.width / this.map.height, 100, 1000);

        this.camera.position.x = (this.map.width / 2) * this.map.blockWidth;
        this.camera.position.y = (this.map.height / 2) * this.map.blockHeight;
        this.camera.position.z = this.map.blockDepth * 6;

        let ambientLight = new THREE.AmbientLight(0x030303);

        this.scene.add(ambientLight);

        this.cameraFollowLight = new THREE.SpotLight(0xfffffff, 2, 800);
        this.cameraFollowLight.angle = 135 * (Math.PI / 180);
        this.cameraFollowLight.exponent = 10;
        this.cameraFollowLight.target = this.cameraFollowView.mesh;

        this.scene.add(this.cameraFollowLight);

        this._initialized = true;
    }

    update (delta) {
        if (this.state.paused) {
            return;
        }

        super.update(delta);

        if (this.cameraFollowView) {
            this.camera.position.setX(this.cameraFollowView.position.x);
            this.camera.position.setY(this.cameraFollowView.position.y);

            this.cameraFollowLight.position.setX(this.cameraFollowView.position.x);
            this.cameraFollowLight.position.setY(this.cameraFollowView.position.y);
            this.cameraFollowLight.position.setZ(this.cameraFollowView.position.z + 400);
        }
    }
}

module.exports = PlayRenderView;
