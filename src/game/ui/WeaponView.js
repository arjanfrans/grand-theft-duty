let debug = require('debug')('game:game/ui/WeaponView');

import View from '../../engine/views/View';
import TextureManager from '../../engine/graphics/TextureManager';
import DynamicTexture from '../../engine/graphics/DynamicTexture';

class WeaponView extends View {
    constructor () {
        super();

        this._weapon = null;
    }

    init () {
        let textureAtlas = TextureManager.getAtlas('ui', true);

        this.geometry = new THREE.PlaneGeometry(196, 64);
        this.dynamicTexture = new DynamicTexture(textureAtlas, this.geometry);

        this.material = new THREE.MeshBasicMaterial({
            map: this.dynamicTexture.texture,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this._initialized = true;
    }

    set weapon (weapon) {
        if (this._weapon !== weapon) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            this._weapon = weapon;
            this.dynamicTexture.frame = weapon;
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
