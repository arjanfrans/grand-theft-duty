let Vector2 = require('math-utils').Vector2;

class Polygon {
    constructor (position, vertices = []) {
        this.vertices = vertices;
        this.angle = 0;
        this.position = position;

        // this._sortVertices();
    }

    _sortVertices () {
        // let newVertices = [];
        //
        // // Copy array
        // let currentVertices = this.vertices.splice(0);
        //
        // let maxAngle = 0;
        // let maxVector = null;
        // let maxIndex = 0;
        //
        // while (currentVertices.length > 0) {
        //     for (let i = 0; i < currentVertices.length; i++) {
        //         let vector = currentVertices[i];
        //
        //         let dir = vector.clone().sub(this.center);
        //         let angle = Math.atan2(dir.y, dir.x) + Math.PI;
        //
        //         if (angle > maxAngle) {
        //             maxAngle = angle;
        //             maxVector = vector;
        //             maxIndex = i;
        //         }
        //     }
        //
        //     newVertices.push(maxVector);
        //
        //     // Remove from array
        //     currentVertices.splice(maxIndex, 1);
        // }
        //
        // console.log(newVertices);
        // this.vertices = newVertices;
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

            let edge = v1.clone().sub(v2);
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

    get center () {
        let center = new Vector2();

        for (let v of this.vertices) {
            center.add(v);
        }

        return center.divideScalar(this.vertices.length);
    }
}

module.exports = Polygon;
