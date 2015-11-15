let debug = require('debug')('game:engine/views/bullet');

import TextureAtlas from '../../engine/graphics/TextureAtlas';
import View from '../../engine/views/View';

class BulletView extends View {
    constructor (bullet) {
        super();

        this.bullet = bullet;
    }

    init () {
        let bullet = this.bullet;

        this.textureAtlas = new TextureAtlas('world', false);

        this.geometry = new THREE.PlaneGeometry(bullet.width, bullet.height);

        let bounds = this.textureAtlas.getBounds('bullet1');

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        this.material = new THREE.MeshBasicMaterial({
            map: this.textureAtlas.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        this.mesh.rotation.z = bullet.angle + (90 * (Math.PI / 180));
        this._initialized = true;
    }

    get texture () {
        return this.textureAtlas.texture;
    }

    update (delta) {
        this.mesh.position.x = this.bullet.position.x;
        this.mesh.position.y = this.bullet.position.y;
        this.mesh.position.z = this.bullet.position.z;

        this.mesh.rotation.z = this.bullet.angle + (90 * (Math.PI / 180));

        if (this.bullet.dead) {
            this.mesh.visible = false;
        } else {
            this.mesh.visible = true;
        }
    }
}

export default BulletView;
