import Soldier from './Soldier';

class NetworkPlayer extends Soldier {
    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth, team);

        // FIXME make configurable
        this.name = 'player';
        this.id = null;

        this.options.isPlayer = true;
        this.options.audio = true;

        this.inputs = [];
        this.lastInputSeq = 0;
        this.lastInputTime = 0;
        this.movement = {
            x: 0,
            y: 0,
            z: 0,
            angular: 0
        };
    }

    reset () {
        super.reset();
        this.isFireing = false;
        this.isReloading = false;
    }

    fall () {
        this.movement.z -= Math.abs(this.gravity);
    }

    stopFalling () {
        this.movement.z = 0;
    }

    moveUp () {
        this.reverse = false;
        this.movement.x += -this.speed * Math.cos(this.angle);
        this.movement.y += -this.speed * Math.sin(this.angle);
    }

    moveDown () {
        this.reverse = true;
        this.movement.x += this.speed * Math.cos(this.angle);
        this.movement.y += this.speed * Math.sin(this.angle);
    }

    turnLeft () {
        this.movement.angular += this.rotationSpeed * (Math.PI / 180);
    }

    turnRight () {
        this.movement.angular += -this.rotationSpeed * (Math.PI / 180);
    }

    get canFire () {
        return this.currentWeapon ? this.currentWeapon.canFire &&
            this.currentWeapon.magazine !== 0 && !this.currentWeapon.isReloading : false;
    }

    processInput (delta) {
        for (const inputData of this.inputs) {
            if (inputData.seq > this.lastInputSeq) {
                const inputs = inputData.inputs;

                for (const input of inputs) {
                    switch (input) {
                        case 'turnLeft': {
                            this.turnLeft();
                            break;
                        }
                        case 'turnRight': {
                            this.turnRight();
                            break;
                        }
                        case 'moveUp': {
                            this.moveUp();
                            break;
                        }
                        case 'moveDown': {
                            this.moveDown();
                            break;
                        }
                        case 'startRunning': {
                            if (!this.reverse) {
                                this.isRunning = true;
                            }
                            break;
                        }
                        case 'stopRunning': {
                            this.isRunning = false;
                            break;
                        }
                        case 'startFireing': {
                            this.isFireing = true;
                            break;
                        }
                        case 'stopFireing': {
                            this.isFireing = false;
                            break;
                        }
                        case 'reload': {
                            this.reload();
                            this.isReloading = true;
                        }
                    }
                }
            }
        }

        if (this.inputs.length > 0) {
            this.lastInputTime = this.inputs[this.inputs.length - 1].time;
            this.lastInputSeq = this.inputs[this.inputs.length - 1].seq;
        }

        this.inputs = [];
    }

    update (delta) {
        if (!this.dead) {
            this.angle += this.movement.angular * delta;

            if (this.angle < 0) {
                this.angle = (Math.PI * 2) - this.angle;
            }

            this.previousPosition.x = this.position.x;
            this.previousPosition.y = this.position.y;
            this.previousPosition.z = this.position.z;

            this.position.x += this.movement.x * delta;
            this.position.y += this.movement.y * delta;
            this.position.z += this.movement.z * delta;
        }

        if (this.movement.x === 0 || this.movement.y === 0) {
            this.isMoving = false;
            this.isRunning = false;
        } else {
            this.isMoving = true;
        }

        if (this.currentWeapon && !this.currentWeapon.isReloading) {
            this.isReloading = false;
        }

        this.movement = {
            x: 0,
            y: 0,
            z: 0,
            angular: 0
        };
    }

    toJSON () {
        return {
            id: this.id,
            team: this.team,
            name: this.name,
            position: this.position,
            angle: this.angle,
            lastInputSeq: this.lastInputSeq,
            isMoving: this.isMoving,
            reverse: this.reverse,
            isRunning: this.isRunning,
            dead: this.dead,
            isFireing: this.isFireing,
            isReloading: this.currentWeapon ? this.currentWeapon.isReloading : false,
            weapons: this.weapons.map(weapon => weapon.toJSON())
        };
    }
}

export default NetworkPlayer;
