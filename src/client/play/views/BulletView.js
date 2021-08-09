import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import {View} from "../../../engine/graphics/View";
import {TextureManager} from "../../../engine/graphics/TextureManager";
import {TextureFrame} from "../../../engine/graphics/TextureFrame";

class BulletView extends View {
    constructor (bullet) {
        super();

        this.bullet = bullet;
    }

    init () {
        const bullet = this.bullet;

        const textureAtlas = TextureManager.getAtlas('world', false);

        this.geometry = new PlaneGeometry(2, 8);
        this.textureFrame = new TextureFrame(textureAtlas, this.geometry, 'bullet1');
        this.material = new MeshBasicMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        this.mesh.rotation.z = bullet.angle + (90 * (Math.PI / 180));

        super.init();
    }

    update (interpolationPercentage) {
        const previous = this.bullet.previousPosition;
        const current = this.bullet.position;

        this.mesh.position.x = previous.x + (current.x - previous.x) * interpolationPercentage;
        this.mesh.position.y = previous.y + (current.y - previous.y) * interpolationPercentage;
        this.mesh.position.z = previous.z + (current.z - previous.z) * interpolationPercentage;
        this.mesh.rotation.z = this.bullet.angle + (90 * (Math.PI / 180));

        if (this.bullet.dead) {
            this.mesh.visible = false;
        } else {
            this.mesh.visible = true;
        }
    }
}

export default BulletView;
