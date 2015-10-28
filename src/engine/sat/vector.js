function sub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}

function add(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}

function dot (a, b) {
    return a.x * b.x + a.y * b.y;
}

function len2 (v) {
    return dot(v, v);
}

function len (v) {
    return Math.sqrt(len2(v));
}

function normalise (v) {
    var d = len(v);

    if (d > 0) {
        return {
            x: v.x / d,
            y: v.y / d
        };
    }

    return {
        x: v.x,
        y: v.x
    };
}

function scale (v, x, y) {
    return {
        x: v.x * x,
        y: v.y * (y || x)
    };
}

function perp(v) {
  return {
    x: v.y,
    y: -v.x
  };
}

function rotate (v, angle) {
  return {
    x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
    y: v.x * Math.sin(angle) + v.y * Math.cos(angle)
  };
}

function reverse (v) {
  return {
    x: -v.x,
    y: -v.y
  };
}

function project (v1, v2) {
  var amt = dot(v1, v2) / len2(v2);

  return {
    x: amt * v1.x,
    y: amt * v1.y
  };
}

function reflect (v, axis) {
  return reverse(scale(project(v, axis), 2));
}

module.exports = {
    add: add,
    sub: sub,
    subtract: sub,
    len: len,
    length: len,
    len2: len2,
    normalise: normalise,
    normalize: normalise,
    scale: scale,
    dot: dot,
    perp: perp,
    rotate: rotate,
    reverse: reverse,
    project: project,
    reflect: reflect
};
