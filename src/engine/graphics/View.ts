import {Object3D, Vector3} from "three";

export abstract class View {
    public mesh?: Object3D = undefined;
    protected initialPosition?: Vector3 = undefined
    protected _initialized: boolean = false;

    public getMesh(): Object3D
    {
        return this.mesh as Object3D;
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

    set position ({ x, y, z }: {x?: number, y?: number, z?: number}) {
        if (this.mesh && this._initialized) {
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
            this.initialPosition = new Vector3(x, y, z);
        }
    }
}
