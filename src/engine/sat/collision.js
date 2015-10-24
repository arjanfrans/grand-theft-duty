var v = require('./vector');
var shapes = require('./shapes');
var voronoi = require('./voronoi');

let _testCircleCircle = function (a, b) {
    var differenceV = v.sub(b.position, a.position);
    var distanceSq = v.len2(differenceV);

    var totalRadius = a.radius + b.radius;
    var totalRadiusSq = totalRadius * totalRadius;

    if (distanceSq > totalRadiusSq) {
        return false;
    }

    return true;
};

let _isSomething = function (point, radius) {
    return (v.len(point) > radius);
};

let _excludeLeftVoronai = function (circlePos, prevPoint, prevEdge, point, radius, edge) {
    if (voronoi.getRegion(edge, point) !== voronoi.LEFT) {
        return false;
    }

    var point2 = v.sub(circlePos, prevPoint);
    var region = voronoi.getRegion(prevEdge, point2);

    return (region === voronoi.RIGHT && isSomething(point, radius));
};

let _excludeRightVoronoi = function (circlePos, nextPoint, nextEdge, point, radius, edge) {
    if (voronoi.getRegion(edge, point) !== voronoi.RIGHT) {
        return false;
    }

    var point2 = v.sub(circlePos, nextPoint);
    var region = voronoi.getRegion(nextEdge, point2);

    return (region === voronoi.LEFT && isSomething(point2, radius));
};

let _excludeMiddleVoronoi = function (point, edge, radius) {
    var normal = v.normalise(v.perp(edge));
    var dist = v.dot(point, normal);

    return (dist > 0 && (Math.abs(dist) > radius));
};

let _testPolygonCircle = function (polygon, circle) {
    var circlePos = v.sub(circle.position, polygon.position);
    var points = polygon.calcPoints;
    var edges = polygon.edges;

    for (var i = 0; i < points.length; i += 1) {
        var next = i === points.length - 1 ? 0 : i + 1;
        var prev = i === 0 ? points.length - 1 : i - 1;

        var point = v.sub(circlePos, points[i]);

        if (_excludeLeftVoronai(circlePos, points[prev], edges[prev], point, circle.radius, edges[i])) {
            return false;
        }
        if (_excludeRightVoronoi(circlePos, points[next], edges[next], point, circle.radius, edges[i])) {
            return false;
        }
        if (_excludeMiddleVoronoi(point, edges[i], circle.radius)) {
            return false;
        }
    }

    return true;
};

let _testCirclePolygon = function (circle, polygon) {
    return testPolygonCircle(polygon, circle);
};

let _flattenPointsOn = function (points, normal) {
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;

    for (let i = 0; i < points.length; i += 1) {
        let d = v.dot(points[i], normal);

        if (d < min) { min = d; }
        if (d > max) { max = d; }
    }

    return [min, max];
};

let _isSeparatingAxis = function (aPos, bPos, aPoints, bPoints, axis) {
    let offsetV = v.sub(bPos, aPos);
    let projectedOffset = v.dot(offsetV, axis);
    let rangeA = _flattenPointsOn(aPoints, axis);
    let rangeB = _flattenPointsOn(bPoints, axis);

    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;

    return (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]);
};

let _testPolygonPolygon = function (a, b) {
    let aPoints = a.calcPoints;
    let aLen = aPoints.length;
    let bPoints = b.calcPoints;
    let bLen = bPoints.length;

    for (let i = 0; i < aLen; i += 1) {
        if (_isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i])) {
            return false;
        }
    }

    for (let i = 0;i < bLen; i += 1) {
        if (_isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i])) {
            return false;
        }
    }

    return true;
};

let _testVectorCircle = function (point, circle) {
    let differenceV = v.sub(point, circle.position);
    let radiusSq = circle.radius * circle.radius;
    let distanceSq = v.len2(differenceV);

    if (distanceSq <= radiusSq) {
        return true;
    }

    return false;
};

let _testCircleVector = function (circle, vector) {
    return testVectorCircle(vector, circle);
};

let _testVectorPolygon = function (vector, polygon) {
    let unitSquare = shapes.tlSquare(vector, 1);

    return testPolygonPolygon(unitSquare, polygon);
};

let _testPolygonVector = function (polygon, vector) {
    return testVectorPolygon(vector, polygon);
};

let testFuncs = {
    'circle-circle': _testCircleCircle,
    'polygon-circle': _testPolygonCircle,
    'circle-polygon': _testCirclePolygon,
    'polygon-polygon': _testPolygonPolygon,
    'vector-circle': _testVectorCircle,
    'circle-vector': _testCircleVector,
    'vector-polygon': _testVectorPolygon,
    'polygon-vector': _testPolygonVector
};

let _determineShape = function (thing) {
    if (thing.radius) {
        return 'circle';
    } else if (typeof thing.x !== 'undefined' && typeof thing.y !== 'undefined') {
        return 'vector';
    }

    return 'polygon';
};

let test = function (a, b) {
    let key = [_determineShape(a), '-', _determineShape(b)].join('');

    return testFuncs[key](a, b);
};

module.exports = {
    test: test
};
