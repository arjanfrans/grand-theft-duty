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

        this.camera = new THREE.PerspectiveCamera(75, this.world.width / this.world.height, 1, 100000);

        this.camera.position.x = (this.world.width / 2) * this.world.tileWidth;
        this.camera.position.y = (this.world.height / 2) * this.world.tileHeight;
        this.camera.position.z = this.world.tileDepth * 6;


        // let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
        //
        // hemiLight.color.setHSL( 0.6, 1, 0.6 );
        // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        // hemiLight.position.set( 0, 500, 0 );
        //
        // this.scene.add(hemiLight);
        //

        // this is the Sun
        let dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 0.75, 1 );
        dirLight.position.multiplyScalar( 50 );
        // dirLight.shadowCameraVisible = true;
        dirLight.castShadow = true;
        dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

        var d = 30;

        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;
        // the magic is here - this needs to be tweaked if you change dimensions
        dirLight.shadowCameraFar = 3500;
        dirLight.shadowBias = -0.000001;
        dirLight.shadowDarkness = 0.5;
        this.scene.add( dirLight );

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
