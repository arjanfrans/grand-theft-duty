let debug = require('debug')('game:game/ui/AmmoView');

import View from '../../engine/views/View';
import TextureAtlas from '../../engine/graphics/TextureAtlas';

class AmmoView extends View {
    constructor () {
        super();
    }

    init () {
        let textureAtlas = new TextureAtlas('ui');

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let ammoSize = textureAtlas.getFrameSize('ammo');

        let mergedGeometry = new THREE.Geometry();

        let bounds = textureAtlas.getBounds('ammo');

        for (let i = 0; i < 5; i++) {
            console.log(ammoSize);
            let geometry = new THREE.PlaneGeometry(ammoSize.width, ammoSize.height);

            geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
            geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];
            // geometry.rotateZ((Math.PI));

            geometry.translate(i * ammoSize.width, 0, 0);

            mergedGeometry.merge(geometry);
        }

        let ammoMesh = new THREE.Mesh(mergedGeometry, material);

        ammoMesh.scale.set(0.5, 0.5, 1);

        // TODO make nice positioning system for ui
        // ammoMesh.position.x = -(800 / 2) + ammoSize.width;
        // ammoMesh.position.y = (600 / 2) - ammoSize.height;
        // ammoMesh.rotation.z = -90 * (Math.PI / 180);

        this.mesh = ammoMesh;

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default AmmoView;
