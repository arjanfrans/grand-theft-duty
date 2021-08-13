import {Mesh, MeshBasicMaterial, PlaneGeometry} from 'three';
import {View} from "../engine/graphics/View";
import {TextureManager} from "../engine/graphics/TextureManager";
import {TextureFrame} from "../engine/graphics/TextureFrame";
import {Entity} from "../ecs/Entity";
import {PlayState} from "../state/PlayState";
import {WeaponComponent} from "../ecs/components/WeaponComponent";

export class WeaponView extends View {
    private player: Entity;
    private _weapon?: string = undefined;
    private textureFrame?: TextureFrame = undefined;

    constructor (state: PlayState) {
        super();

        this.player = state.getPlayerEntity();
    }

    init () {
        const textureAtlas = TextureManager.getAtlas('ui', true);

        const geometry = new PlaneGeometry(196, 64);
        this.textureFrame = new TextureFrame(textureAtlas, geometry);

        const material = new MeshBasicMaterial({
            map: this.textureFrame.texture,
            transparent: true
        });

        this.mesh = new Mesh(geometry, material);

        super.init();
    }

    set weapon (weapon) {
        const mesh = this.mesh as Mesh;

        if (this._weapon !== weapon) {
            if (!mesh.visible) {
                mesh.visible = true;
            }

            this._weapon = weapon;

            const textureFrame = this.textureFrame as TextureFrame;

            textureFrame.frame = weapon;
        } else if (!weapon) {
            if (mesh.visible) {
                mesh.visible = false;
            }
        }
    }

    update () {
        const weaponComponent = this.player.getComponent<WeaponComponent>(WeaponComponent.TYPE);

        if (weaponComponent.currentWeapon) {
            const weapon = weaponComponent.currentWeapon;

            this.weapon = weapon.name;
        } else {
            this.weapon = undefined;
        }
    }
}
