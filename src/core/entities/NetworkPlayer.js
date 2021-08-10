import {Soldier} from './Soldier';

class Network extends Soldier {
    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth, team);

        // FIXME make configurable
        this.name = 'player';

        this.options.isPlayer = true;
        this.options.audio = true;

        this.inputs = [];
        this.lastInputIndex = 0;
    }

    stopTurning () {
        super.stopTurning();
        this.inputs.push('stopTurning');
    }

    turnRight () {
        super.turnRight();
        this.inputs.push('turnRight');
    }

    trunLeft () {
        super.turnLeft();
        this.inputs.push('turnLeft');
    }

    moveUp () {
        super.moveUp();
        this.inputs.push('moveUp');
    }

    moveDown () {
        super.moveDown();
        this.inputs.push('moveDown');
    }

    update (delta) {
        super.update(delta);
    }
}

export default Network;
