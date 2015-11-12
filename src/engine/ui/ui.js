import TextureAtlas from '../graphics/texture-atlas';
import RenderView from '../graphics/RenderView';

class UI extends RenderView {
    constructor () {
        super();

        this.width = 800;
        this.height = 600;
    }

    init () {
        super.init();

        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2,
            this.height / 2, -this.height / 2, 0, 1);

        let textureAtlas = new TextureAtlas('ui');

        let heartSize = textureAtlas.getFrameSize('heart');

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let geometry = new THREE.PlaneGeometry(heartSize.width, heartSize.height);
        let bounds = textureAtlas.getBounds('heart');

        geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        let heartMesh = new THREE.Mesh(geometry, material);

        heartMesh.scale.set(0.5, 0.5, 1);

        heartMesh.position.x = -(this.width / 2) + heartSize.width;
        heartMesh.position.y = (this.height / 2) - heartSize.height;
        heartMesh.rotation.z = -90 * (Math.PI / 180);

        this.scene.add(heartMesh);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }

}

export default UI;
