let debug = require('debug')('game:engine/views/bullet');

import TextureManager from '../../engine/graphics/TextureManager';
import DynamicTexture from '../../engine/graphics/DynamicTexture';
import View from '../../engine/views/View';

class BulletView extends View {
    constructor (bullet) {
        super();

        this.bullet = bullet;
    }

    init () {
        let bullet = this.bullet;

        let textureAtlas = TextureManager.getAtlas('world', false);

        this.geometry = new THREE.PlaneGeometry(bullet.width, bullet.height);

        this.dynamicTexture = new DynamicTexture(textureAtlas, this.geometry);

        this.material = new THREE.MeshBasicMaterial({
            map: this.dynamicTexture.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        this.mesh.rotation.z = bullet.angle + (90 * (Math.PI / 180));

        this._initialized = true;
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
