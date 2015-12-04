import TextureManager from '../../engine/graphics/TextureManager';
import TextureFrame from '../../engine/graphics/TextureFrame';
import View from '../../engine/views/View';

class BulletView extends View {
    constructor (bullet) {
        super();

        this.bullet = bullet;
    }

    init () {
        let bullet = this.bullet;

        let textureAtlas = TextureManager.getAtlas('world', false);

        this.geometry = new THREE.PlaneGeometry(2, 8);
        this.textureFrame = new TextureFrame(textureAtlas, this.geometry, 'bullet1');
        this.material = new THREE.MeshBasicMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        this.mesh.rotation.z = bullet.angle + (90 * (Math.PI / 180));

        super.init();
    }

    update (interpolationPercentage) {
        let previous = this.bullet.previousPosition;
        let current = this.bullet.position;

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
