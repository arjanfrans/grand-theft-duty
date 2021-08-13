import {ComponentInterface} from "./ComponentInterface";
import Gun from "../../core/weapons/Gun";

enum Direction {
    UP= "UP",
    DOWN= "DOWN"
}

export class WeaponComponent implements ComponentInterface {
    public static TYPE: string = 'WeaponComponent';

    public weapons: Gun[] = [];
    public currentWeaponIndex: number = 0;
    public currentWeapon?: Gun = undefined;
    public firedBullet: boolean = false;

    constructor(weapons: Gun[], currentWeapon?: Gun) {
        this.weapons = weapons;

        if (currentWeapon) {
            this.currentWeapon = currentWeapon;
        } else if (weapons.length > 0) {
            this.currentWeapon = weapons[0];
        }
    }

    addWeapon(weapon: Gun) {
        // TODO increase ammo if weapon is the same
        this.weapons.push(weapon);
    }

    fireBullet() {
        if (this.currentWeapon) {
            this.firedBullet = true;
        }
    }

    reload() {
        if (this.currentWeapon) {
            this.currentWeapon.reload();
        }
    }

    public scrollWeaponsDown(): void
    {
        this.scrollWeapons(Direction.DOWN)
    }

    public scrollWeaponsUp(): void
    {
        this.scrollWeapons(Direction.UP)
    }

    private scrollWeapons(direction: Direction) {
        if (direction === Direction.UP) {
            if (this.currentWeaponIndex === this.weapons.length - 1) {
                this.currentWeaponIndex = 0;
            } else {
                this.currentWeaponIndex += 1;
            }
        } else if (direction === Direction.DOWN) {
            if (this.currentWeaponIndex === 0) {
                this.currentWeaponIndex = this.weapons.length - 1;
            } else {
                this.currentWeaponIndex -= 1;
            }
        } else {
            throw new Error('direction is not "UP" or "DOWN"');
        }

        this.currentWeapon = this.weapons[this.currentWeaponIndex];
    }

    get type(): string
    {
        return WeaponComponent.TYPE;
    }
}
