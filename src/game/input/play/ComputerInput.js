class ComputerInput {
    constructor (soldier) {
        this.soldier = soldier;
    }

    update () {
        if (Math.random() < 0.05) {
            this.soldier.fireBullet();
        }

        if (Math.random() > 0.8) {
            this.soldier.move('up');
        }

        if (Math.random() > 0.9) {
            if (Math.random() > 0.5) {
                this.soldier.turn('right');
            } else {
                this.soldier.turn('left');
            }
        }

        if (this.soldier.currentWeapon) {
            if (this.soldier.currentWeapon.magazine === 0) {
                this.soldier.reload();
            }
        }
    }
}

export default ComputerInput;
