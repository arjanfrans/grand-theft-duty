import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry, SpotLight } from 'three';
import { TextureFrame } from '../../../../engine/graphics/TextureFrame';
import {TextureManager} from "../../../../engine/graphics/TextureManager";
import {View} from "../../../../engine/graphics/View";

class LightView extends View {
    constructor (light) {
        super();
        this.light = light;
    }

    init () {
        this.mesh = new Object3D();

        const textureAtlas = TextureManager.getAtlas('world', true);
        const lightGeometry = new PlaneGeometry(32, 32);

        this.textureFrame = new TextureFrame(textureAtlas, lightGeometry, 'light1');

        const lightMaterial = new MeshLambertMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });

        const lightMesh = new Mesh(lightGeometry, lightMaterial);

        lightMesh.position.set(this.light.sourcePosition.x, this.light.sourcePosition.y, this.light.sourcePosition.z);
        lightMesh.rotateZ(this.light.angle + (90 * (Math.PI / 180)));

        this.mesh.add(lightMesh);

        const spotLight = new SpotLight(0xff00000, 1);

        const target = new Object3D();

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
