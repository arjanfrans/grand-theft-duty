import Polygon from '../collision/Polygon';
import Vector from '../collision/Vector';

class Entity {
    constructor (x = 0, y = 0, z = 0, width = 0, height = 0, depth = 0) {
        this.position = {
            x: x,
            y: y,
            z: z
        };

        this.previousPosition = {
            x: x,
            y: y,
            z: z
        };

        this.collidable = true;

        this.width = width;
        this.height = height;
        this.depth = depth;

        this.reset();

        this._body = new Polygon(new Vector(this.x, this.y), [
            new Vector(-this.halfWidth, -this.halfHeight),
            new Vector(-this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, this.halfHeight),
            new Vector(this.halfWidth, 0)
        ]);

        this.options = {
            physics: false,
            bullets: false,
            audio: false,
            isBullet: false,
            isPlayer: false,
            isCharacter: false
        };
    }

    get rotatedBody () {
        let body = this._body;

        this._body.position.x = this.position.x;
        this._body.position.y = this.position.y;

        body.setAngle(this.angle);

        return body;
    }

    get body () {
        this._body.position.x = this.position.x;
        this._body.position.y = this.position.y;

        return this._body;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }

    get z () {
        return this.position.z;
    }

    kill () {
        this.dead = true;
    }

    get point () {
        return new Vector(this.x, this.y);
    }

    reset () {
        this.dead = false;
        this.angle = Math.PI * 2;

        // Actions can trigger things that should happen in the next update.
        this.actions = {};
    }

    respawn (position) {
        this.reset();

        this.position = {
            x: position.x,
            y: position.y,
            z: position.z
        };

        this.previousPosition = {
            x: position.x,
            y: position.y,
            z: position.z
        };
    }

    update () {}
};

export default Entity;
