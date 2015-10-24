var v = require('./vector');
var tlBox = require('./shapes').tlBox;

function recalc (polygon) {
    let calcPoints = polygon.calcPoints;
    let edges = polygon.edges;
    let normals = polygon.normals;
    let points = polygon.points;
    let offset = polygon.offset;
    let angle = polygon.angle;

    for (let i = 0; i < points.length; i += 1) {
        let calcPoint = v.add(points[i], offset);

        if (angle !== 0) {
            v.rotate(calcPoint, angle);
        }

        calcPoints[i] = calcPoint;
    }

    for (let i = 0; i < points.length; i += 1) {
        let p1 = calcPoints[i];
        let p2 = i < points.length - 1 ? calcPoints[i + 1] : calcPoints[0];

        edges[i] = v.sub(p2, p1);
        normals[i] = v.normalise(v.perp(edges[i]));
    }

    return polygon;
}

function setPoints (polygon, points) {
    let lengthChanged = !polygon.points || polygon.points.length !== points.length;

    let calcPoints = [];
    let edges = [];
    let normals = [];

    if (lengthChanged) {
        for (let i = 0; i < points.length; i += 1) {
            calcPoints.push({x: 0, y: 0});
            edges.push({x: 0, y: 0});
            normals.push({x: 0, y: 0});
        }
    }

    return recalc({
        position: polygon.position,
        angle: polygon.angle,
        offset: polygon.offset,
        points: points,
        calcPoints: lengthChanged ? calcPoints : polygon.calcPoints,
        edges: lengthChanged ? edges : polygon.edges,
        normals: lengthChanged ? normals : polygon.normals
    });
}

function rotate (p, angle) {
    let points = [];

    for (let i = 0; i < p.points.length; i += 1) {
        points.push(v.rotate(p.points[i], angle));
    }

    return setPoints(p, points);
}

function translate (p, vector) {
    let points = [];

    for (let i = 0; i < p.points.length; i += 1) {
        points.push(v.add(p.points[i], vector));
    }

    return setPoints(p, points);
}

function setAngle (p, angle) {
    return setPoints({
        position: p.position,
        angle: angle,
        offset: p.offset
    }, p.points);
}

function setOffset (p, offset) {
    return setPoints({
        position: p.position,
        angle: p.angle,
        offset: offset
    }, p.points);
}

function getAABB (polygon) {
    let xMin = polygon.points[0].x;
    let yMin = polygon.points[0].y;
    let xMax = polygon.points[0].x;
    let yMax = polygon.points[0].y;

    for (let i = 1; i < polygon.calcPoints.length; i += 1) {
        let point = polygon.calcPoints[i];

        if (point.x < xMin) {
            xMin = point.x;
        } else if (point.x > xMax) {
            xMax = point.x;
        }
        if (point.y < yMin) {
            yMin = point.y;
        } else if (point.y > yMax) {
            yMax = point.y;
        }
    }

    tlBox(v.add(polygon.position, {x: xMin, y: yMin}), xMax - xMin, yMax - yMin);
}

function create (point, points) {
    var poly = {
        position: point,
        angle: 0,
        offset: {x: 0, y: 0}
    };

    return setPoints(poly, points);
}

module.exports = {
    create: create,
    rotate: rotate,
    translate: translate,
    setPoints: setPoints,
    setOffset: setOffset,
    setAngle: setAngle,
    getAABB: getAABB
};
