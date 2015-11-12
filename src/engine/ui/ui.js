import TextureAtlas from '../graphics/texture-atlas';

class UI {
    constructor () {
        this.width = 800;
        this.height = 600;

        this.mesh = null;
    }

    init () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2,
            height / 2, -height / 2, 1, 100000);

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

        this.scene.add(heartMesh);
    }

    update () {

    }

}

export default UI;
