class View {
    constructor () {
        this.mesh = null;
        this.initialPosition = null;
        this._initialized = false;
    }

    init () {
        if (this.initialPosition) {
            if (!this.mesh) {
                throw new Error('No mesh initialized!');
            }

            this.mesh.position.x = this.initialPosition.x;
            this.mesh.position.y = this.initialPosition.y;
            this.mesh.position.z = this.initialPosition.z;
        }

        this._initialized = true;
    }

    get position () {
        return this.mesh.position;
    }

    set position ({ x, y, z }) {
        if (this.mesh && this.initialized) {
            if (x) {
                this.mesh.position.x = x;
            }

            if (y) {
                this.mesh.position.y = y;
            }

            if (z) {
                this.mesh.position.z = z;
            }
        } else {
            this.initialPosition = {
                x: x,
                y: y,
                z: z
            };
        }
    }
}

export default View;
