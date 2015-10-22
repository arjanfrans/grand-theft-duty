class Polygon {
    constructor (position, vertices) {
        this.vertices = vertices;
        this.angle = 0;
        this.position = position;
    }

    get length () {
        return this.vertices.length;
    }

    get axis () {
        let axis = [];
        let vertices = this.vertices;

        for (let i = 0; i < vertices.length; i++) {
            let v1 = vertices[i];
            let v2;

            if (i === vertices.length - 1) {
                v2 = vertices[0];
            } else {
                v2 = vertices[i + 1];
            }

            let edge = v1.sub(v2);

            let normal = edge.perp();

            axis.push(normal);
        }

        return axis;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }
}

module.exports = Polygon;
