import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { TextureFrame, TextureManager, View } from '../../../engine/graphics';

class WeaponView extends View {
    constructor (state) {
        super();

        this.player = state.player;
        this._weapon = null;
    }

    init () {
        const textureAtlas = TextureManager.getAtlas('ui', true);

        this.geometry = new PlaneGeometry(196, 64);
        this.textureFrame = new TextureFrame(textureAtlas, this.geometry);

        this.material = new MeshBasicMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });

        this.mesh = new Mesh(this.geometry, this.material);

        super.init();
    }

    set weapon (weapon) {
        if (this._weapon !== weapon) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            this._weapon = weapon;
            this.textureFrame.frame = weapon;
        } else if (weapon === null) {
            if (this.mesh.visible) {
                this.mesh.visible = false;
            }
        }
    }

    update (delta) {
        if (this.player.currentWeapon) {
            const weapon = this.player.currentWeapon;

            this.weapon = weapon.name;
        } else {
            this.weapon = null;
        }
    }
}

export default WeaponView;
