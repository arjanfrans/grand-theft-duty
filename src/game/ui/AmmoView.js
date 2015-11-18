let debug = require('debug')('game:game/ui/AmmoView');

import View from '../../engine/views/View';
import TextureAtlas from '../../engine/graphics/TextureAtlas';
import TextView from '../../engine/views/TextView';

class AmmoView extends View {
    constructor () {
        super();
    }

    init () {
        this.mesh = new THREE.Object3D();

        let textureAtlas = new TextureAtlas('ui');

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let ammoSize = textureAtlas.getFrameSize('ammo');
        let bounds = textureAtlas.getBounds('ammo');

        this.geometry = new THREE.PlaneGeometry(ammoSize.width, ammoSize.height);

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        let ammoMesh = new THREE.Mesh(this.geometry, material);

        ammoMesh.scale.set(0.5, 0.5, 1);

        this.textView = new TextView('0', {
            color: 0xD2ff33
        });

        this.textView.init();

        this.textView.mesh.scale.set(2, 2, 1);

        this.textView.position = {
            x: ammoSize.width + 10,
            y: -this.textView.height
        };

        this.mesh.add(this.textView.mesh);
        this.mesh.add(ammoMesh);

        this._initialized = true;
    }

    set ammo (ammo) {
        this.textView.text = ammo;
    }

    update (delta) {
        super.update(delta);
    }
}

export default AmmoView;
