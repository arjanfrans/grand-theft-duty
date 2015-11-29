class Light {
    constructor (x, y, z, color) {
        this.position = {
            x: x,
            y: y,
            z: z
        };
        this.color = color;
        this.sourcePosition = {
            x: x,
            y: y,
            z: z
        };

        this.angle = Math.PI * 2;
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
}

export default Light;
