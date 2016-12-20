import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';
import { TextView, TextureFrame, TextureManager, View } from '../../../engine/graphics';

class AmmoView extends View {
    constructor (state) {
        super();

        this.player = state.player;
    }

    init () {
        this.mesh = new Object3D();

        const textureAtlas = TextureManager.getAtlas('ui', false);

        const material = new MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        const ammoSize = textureAtlas.getFrameSize('ammo');

        this.geometry = new PlaneGeometry(ammoSize.width, ammoSize.height);
        this.textureFrame = new TextureFrame(textureAtlas, this.geometry, 'ammo');

        const ammoMesh = new Mesh(this.geometry, material);

        ammoMesh.scale.set(0.5, 0.5, 1);

        this.magazineText = new TextView('0', {
            color: 0xffffcc
        });

        this.magazineText.init();

        this.magazineText.mesh.scale.set(2, 2, 1);

        this.magazineText.position = {
            x: ammoSize.width + 10,
            y: -this.magazineText.height
        };

        this.mesh.add(this.magazineText.mesh);

        this.ammoText = new TextView('0', {
            color: 0xffff99
        });

        this.ammoText.init();

        this.ammoText.mesh.scale.set(1, 1, 1);

        this.ammoText.position = {
            x: ammoSize.width + 64,
            y: -this.ammoText.height
        };

        ammoMesh.position.x = 20;
        this.magazineText.position.x = 40;
        this.ammoText.position.x = 120;

        this.mesh.add(this.ammoText.mesh);
        this.mesh.add(ammoMesh);

        super.init();
    }

    set ammo (ammo) {
        if (ammo === null) {
            this.ammoText.text = '-';
        }
        this.ammoText.text = ammo;
    }

    set magazine (magazine) {
        if (magazine === null) {
            this.magazineText.text = '-';
        }
        this.magazineText.text = magazine;
    }

    update (delta) {
        if (this.player.currentWeapon) {
            const weapon = this.player.currentWeapon;

            this.ammo = weapon.ammo;
            this.magazine = weapon.magazine;
        } else {
            this.ammo = null;
            this.magazine = null;
        }
    }
}

export default AmmoView;
