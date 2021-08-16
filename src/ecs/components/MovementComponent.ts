import { Vector3 } from "three";
import { ComponentInterface } from "./ComponentInterface";

const DEFAULT_SPEED = 0.2;
const DEFAULT_ROTATION_SPEED = 0.3;
const GRAVITY = -0.2;

export class MovementComponent implements ComponentInterface {
    public static TYPE: string = "MovementComponent";
    public speed: number;
    public readonly velocity: Vector3;
    public angularVelocity: number;
    public reverse: boolean;
    public rotationSpeed: number;
    public angle: number;
    public isMoving: boolean = false;
    public walkingSpeed: number = 0.1;
    public runningSpeed: number = 0.2;
    private _isRunning: boolean = false;

    constructor(
        velocityX: number = 0,
        velocityY: number = 0,
        velocityZ: number = 0,
        angularVelocity: number = 0,
        reverse: boolean = false,
        speed: number = DEFAULT_SPEED,
        rotationSpeed: number = DEFAULT_ROTATION_SPEED,
        angle: number = Math.PI * 2
    ) {
        this.speed = speed;
        this.velocity = new Vector3(velocityX, velocityY, velocityZ);
        this.angularVelocity = angularVelocity;
        this.reverse = reverse;
        this.rotationSpeed = rotationSpeed;
        this.angle = angle;
    }

    fall() {
        this.velocity.z = GRAVITY;
    }

    moveUp() {
        this.reverse = false;
        this.isMoving = true;
        this.velocity.x = -this.speed * Math.cos(this.angle);
        this.velocity.y = -this.speed * Math.sin(this.angle);
    }

    moveDown() {
        this.reverse = true;
        this.isMoving = true;
        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);
    }

    turnLeft() {
        this.angularVelocity = this.rotationSpeed * (Math.PI / 180);
    }

    turnRight() {
        this.angularVelocity = -this.rotationSpeed * (Math.PI / 180);
    }

    stopMoving() {
        this.isMoving = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    stopTurning() {
        this.angularVelocity = 0;
    }

    set isRunning(running) {
        if (running) {
            this._isRunning = true;
            this.speed = this.runningSpeed;
        } else {
            this._isRunning = false;
            this.speed = this.walkingSpeed;
        }
    }

    get isRunning() {
        return this._isRunning;
    }

    reset() {
        this.velocity.set(0, 0, 0);
        this.reverse = false;
        this.angle = Math.PI * 2;
        this.angularVelocity = 0;

        // If entity is moving backwards
        this.reverse = false;

        this.isMoving = false;
    }

    stopFalling() {
        this.velocity.z = 0;
    }

    get type(): string {
        return MovementComponent.TYPE;
    }
}
