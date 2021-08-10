import {Soldier} from "../../../core/entities/Soldier";
import {StateInput} from "../../../engine/state/StateInput";

export class ComputerInput implements StateInput {
    private readonly soldier: Soldier;

    constructor (soldier: Soldier) {
        this.soldier = soldier;
    }

    update () {
        if (Math.random() < 0.05) {
            this.soldier.fireBullet();
        }

        if (Math.random() > 0.8) {
            this.soldier.moveUp();
        }

        if (Math.random() > 0.7) {
            if (Math.random() > 0.5) {
                this.soldier.turnRight();
            } else {
                this.soldier.turnLeft();
            }
        } else {
            this.soldier.stopTurning();
        }

        if (this.soldier.currentWeapon) {
            if (this.soldier.currentWeapon.magazine === 0) {
                this.soldier.reload();
            }
        }
    }
}
