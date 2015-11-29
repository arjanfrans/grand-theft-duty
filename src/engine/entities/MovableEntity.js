import Entity from './Entity';

const DEFAULT_SPEED = 0.2;
const DEFAULT_ROTATION_SPEED = 0.3;

class MovableEntity extends Entity {
    constructor (x, y, z, width, height, depth) {
        super(x, y, z, width, height, depth);

        this.speed = DEFAULT_SPEED;
        this.rotationSpeed = DEFAULT_ROTATION_SPEED;
    }

    reset () {
        super.reset();

        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };

        this.angularVelocity = 0;

        // If entity is moving backwards
        this.reverse = false;
        this.isMoving = false;
    }

    /**
     * Move the entity in direction "up" or "down".
     *
     * @param {string} direction "up" or "down"
     *
     * @returns {void}
     */
    move (direction) {
        let speed = this.speed;

        if (direction === 'up') {
            this.reverse = false;
            speed = -this.speed;
        } else {
            this.reverse = true;
            speed = this.speed;
        }

        this.isMoving = true;
        this.velocity.x = speed * Math.cos(this.angle);
        this.velocity.y = speed * Math.sin(this.angle);
    };

    /**
     * Turn an entity to the "left" or "right".
     *
     * @param {string} direction "left" or "right"
     *
     * @returns {void}
     */
    turn (direction) {
        let rotationSpeed = this.rotationSpeed;

        if (direction === 'right') {
            rotationSpeed = -this.rotationSpeed;
        }

        this.angularVelocity = rotationSpeed * (Math.PI / 180);
    }

    stopMoving () {
        this.isMoving = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    stopTurning () {
        this.angularVelocity = 0;
    }

    update (delta) {
        if (!this.dead) {
            this.angle += this.angularVelocity * delta;

            if (this.angle < 0) {
                this.angle = (Math.PI * 2) - this.angle;
            }

            this.previousPosition.x = this.position.x;
            this.previousPosition.y = this.position.y;
            this.previousPosition.z = this.position.z;

            this.position.x += this.velocity.x * delta;
            this.position.y += this.velocity.y * delta;
            this.position.z += this.velocity.z * delta;
        }
    }
}

export default MovableEntity;
