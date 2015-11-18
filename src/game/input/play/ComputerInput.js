let debug = require('debug')('game:engine/input/play/ComputerInput');

class ComputerInput {
    constructor (entity) {
        this.entity = entity;
    }

    update () {
        if (Math.random() < 0.05) {
            this.entity.fireBullet();
        }
    }
}

export default ComputerInput;
