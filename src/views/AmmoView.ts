import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three";
import { View } from "../engine/graphics/View";
import { TextureManager } from "../engine/graphics/TextureManager";
import { TextureFrame } from "../engine/graphics/TextureFrame";
import { TextView } from "../engine/graphics/TextView";
import { Entity } from "../ecs/entities/Entity";
import { WeaponComponent } from "../ecs/components/WeaponComponent";
import { PlayState } from "../state/PlayState";
import { PlayerQuery } from "../ecs/entities/queries/PlayerQuery";

class AmmoView extends View {
    private player: Entity;
    private magazineText?: TextView = undefined;
    private ammoText?: TextView = undefined;

    constructor(state: PlayState) {
        super();

        this.player = PlayerQuery.getPlayerEntity(state.em);
    }

    init() {
        this.mesh = new Object3D();

        const textureAtlas = TextureManager.getAtlas("ui", false);

        const material = new MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true,
        });

        const ammoSize = textureAtlas.getFrameSize("ammo");

        const geometry = new PlaneGeometry(ammoSize.width, ammoSize.height);
        const textureFrame = new TextureFrame(textureAtlas, geometry);

        textureFrame.frame = "ammo";

        const ammoMesh = new Mesh(geometry, material);

        ammoMesh.scale.set(0.5, 0.5, 1);

        const magazineText = new TextView("0", {
            color: 0xffffcc,
        });

        magazineText.init();

        magazineText.getMesh().scale.set(2, 2, 1);

        magazineText.position = {
            x: ammoSize.width + 10,
            y: -magazineText.height,
        };

        this.getMesh().add(magazineText.getMesh());

        const ammoText = new TextView("0", {
            color: 0xffff99,
        });

        ammoText.init();

        ammoText.getMesh().scale.set(1, 1, 1);

        ammoText.position = {
            x: ammoSize.width + 64,
            y: -ammoText.height,
        };

        ammoMesh.position.x = 20;
        magazineText.getMesh().position.x = 40;
        ammoText.getMesh().position.x = 120;

        this.getMesh().add(ammoText.getMesh());
        this.getMesh().add(ammoMesh);

        this.magazineText = magazineText;
        this.ammoText = ammoText;

        super.init();
    }

    set ammo(ammo) {
        const ammoText = this.ammoText as TextView;

        if (ammo === null) {
            ammoText.text = "-";
        }
        ammoText.text = ammo;
    }

    set magazine(magazine) {
        const magazineText = this.magazineText as TextView;

        if (magazine === null) {
            magazineText.text = "-";
        }
        magazineText.text = magazine;
    }

    update() {
        const weaponComponent = this.player.getComponent<WeaponComponent>(
            WeaponComponent.TYPE
        );

        if (weaponComponent.currentWeapon) {
            const weapon = weaponComponent.currentWeapon;

            this.ammo = weapon.ammo;
            this.magazine = weapon.magazine;
        } else {
            this.ammo = undefined;
            this.magazine = undefined;
        }
    }
}

export default AmmoView;
