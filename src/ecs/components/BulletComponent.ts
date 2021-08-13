import {ComponentInterface} from "./ComponentInterface";
import {SoldierComponent} from "./SoldierComponent";

export class BulletComponent implements ComponentInterface {
    public static TYPE = 'BulletComponent';

    public firedBy?: SoldierComponent;
    public firedByWeapon?: any;
    public readonly maxDistance: number = 500;
    public traveledDistance: number = 0;

    get damage() {
        if (this.firedByWeapon) {
            return this.firedByWeapon.damage;
        }

        return 0;
    }

    get type(): string
    {
        return BulletComponent.TYPE;
    }

}
