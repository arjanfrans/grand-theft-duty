import Soldier from '../../../../engine/entities/Soldier';

class Player extends Soldier {
    constructor (x, y, z, width, height, depth, team) {
        super(x, y, z, width, height, depth, team);

        // FIXME make configurable
        this.name = 'player';

        this.options.isPlayer = true;
        this.options.audio = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default Player;
