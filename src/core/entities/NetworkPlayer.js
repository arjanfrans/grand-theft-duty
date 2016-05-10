import Soldier from './Soldier';

class Network extends Soldier {
    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth, team);

        // FIXME make configurable
        this.name = 'player';

        this.options.isPlayer = true;
        this.options.audio = true;

        this.inputs = [];
        this.lastInputSeq = 0;
        this.lastInputTime = 0;
    }

    update (delta) {
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
                        case 'stopMoving': {
                            this.stopMoving();
                            break;
                        }
                    }
                }
            }
        }

        if (this.inputs.length > 0) {
            this.lastInputTime = this.inputs[this.inputs.length - 1].time;
            this.lastInputSeq = this.inputs[this.inputs.length - 1].seq;
        }

        super.update(delta);
    }

    toJSON () {
        return {
            team: this.team,
            name: this.name,
            position: this.position,
            lastInputSeq: this.lastInputSeq
        };
    }
}

export default Network;
