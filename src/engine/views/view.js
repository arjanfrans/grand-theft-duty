let debug = require('debug')('game:engine/views/view');

class View {
    constructor () {
        this.mesh = null;
        this._initialized = false;
    }

    init () {
        throw new TypeError('View requires init() method');
    }

    get position () {
        return this.mesh.position;
    }
}

export default View;
