import TextureManager from '../../graphics/TextureManager';
import TextureFrame from '../../graphics/TextureFrame';
import View from '../View';

class LightView extends View {
    constructor (light) {
        super();
        this.light = light;
    }

    init () {
        this.mesh = new THREE.Object3D();

        let textureAtlas = TextureManager.getAtlas('world', true);
        let lightGeometry = new THREE.PlaneGeometry(32, 32);

        this.textureFrame = new TextureFrame(textureAtlas, lightGeometry, 'light1');

        let lightMaterial = new THREE.MeshLambertMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });

        let lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);

        lightMesh.position.set(this.light.sourcePosition.x, this.light.sourcePosition.y, this.light.sourcePosition.z);
        lightMesh.rotateZ(this.light.angle + (90 * (Math.PI / 180)));

        this.mesh.add(lightMesh);

        let spotLight = new THREE.SpotLight(0xff00000, 1);

        let target = new THREE.Object3D();

        target.position.set(this.light.x, this.light.y, -this.light.z);
        target.rotateZ(this.light.angle + (90 * (Math.PI / 180)));

        this.mesh.add(target);

        spotLight.target = target;
        spotLight.angle = 45 * (Math.PI / 180);
        spotLight.position.set(this.light.sourcePosition.x, this.light.sourcePosition.y, this.light.sourcePosition.z);
        spotLight.rotateZ(this.light.angle + (90 * (Math.PI / 180)));

        this.mesh.add(spotLight);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.translateX(100 / 2);
        this.mesh.translateY(100 / 2);
        this.mesh.translateZ(100);

        super.init();
    }
}

export default LightView;
