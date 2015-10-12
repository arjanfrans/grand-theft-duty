/**
 * Base class for all states.
 *
 * @class
 */
class State {

    /**
     * @constructor
     *
     * @param {string} name - name of the state.
     */
    constructor (name) {
        this.name = name;
    }

    update () {
        throw new TypeError('State requires update() method');
    }
}

module.exports = State;
