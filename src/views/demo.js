let View = require('../engine/view');

class DemoView extends View {
    constructor () {
        super(800, 600);

        this.geometry = new THREE.BoxGeometry(200, 200, 200);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);
    }

    update () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
    }
}

module.exports = DemoView;
