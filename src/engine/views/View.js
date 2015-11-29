let debug = require('debug')('game:engine/views/view');

class View {
    constructor () {
        this.mesh = null;
        this._initialized = false;
    }

    init () {
        this._initialized = true;
    }

    get position () {
        return this.mesh.position;
    }

    set position (position = { x: 0, y: 0, z: 0}) {
        if (position.x) {
            this.mesh.position.x = position.x;
        }

        if (position.y) {
            this.mesh.position.y = position.y;
        }

        if (position.z) {
            this.mesh.position.z = position.z;
        }
    }
}

export default View;
