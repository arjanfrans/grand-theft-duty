let debug = require('debug')('game:game/ui/WeaponView');

import View from '../../engine/views/View';
import TextureAtlas from '../../engine/graphics/TextureAtlas';

class WeaponView extends View {
    constructor () {
        super();

        this._weapon = null;
    }

    init () {
        this.textureAtlas = new TextureAtlas('ui');
        this.texture = this.textureAtlas.texture;

        let material = new THREE.MeshBasicMaterial({
            map: this.textureAtlas.texture,
            transparent: true
        });

        // TODO remove hardcoded mp44
        let weaponSize = this.textureAtlas.getFrameSize('mp44');

        let bounds = this.textureAtlas.getBounds('mp44');

        // TODO set a standard size
        this.geometry = new THREE.PlaneGeometry(weaponSize.width, weaponSize.height);

        this.geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
        this.geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

        let weaponMesh = new THREE.Mesh(this.geometry, material);

        // weaponMesh.scale.set(0.5, 0.5, 1);

        this.mesh = weaponMesh;

        this._initialized = true;
    }

    set weapon (weapon) {
        if (this._weapon !== weapon) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            this._weapon = weapon;

            let bounds = this.textureAtlas.getFrameOffset(weapon);

            this.texture.offset = bounds;
            this.geometry.uvsNeedUpdate = true;
        } else if (weapon === null) {
            if (this.mesh.visible) {
                this.mesh.visible = false;
            }
        }
    }

    update (delta) {
        super.update(delta);
    }
}

export default WeaponView;
