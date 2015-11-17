let debug = require('debug')('game:game/ui/WeaponView');

import View from '../../engine/views/View';
import TextureAtlas from '../../engine/graphics/TextureAtlas';

class WeaponView extends View {
    constructor () {
        super();
    }

    init () {
        let textureAtlas = new TextureAtlas('ui');

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let weaponSize = textureAtlas.getFrameSize('mp44');

        let bounds = textureAtlas.getBounds('mp44');

        let geometry = new THREE.PlaneGeometry(weaponSize.width, weaponSize.height);

        geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        let weaponMesh = new THREE.Mesh(geometry, material);

        // weaponMesh.scale.set(0.5, 0.5, 1);

        this.mesh = weaponMesh;

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default WeaponView;
