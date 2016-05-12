'use strict';

function add (a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}

function sub (a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}


/**
 * Scale a vector. An independant scaling factor can be provided
 * for each axis, or a single scaling factor that will scale both `x` and `y`.
 *
 * @param {object} v Vector to scale.
 * @param {number} x The scaling factor in the x direction.
 * @param {number} [y] The scaling factor in the y direction.
 * If this is not specified, the x scaling factor will be used.
 *
 * @return {object} Resulting vector.
 */
function scale (v, x, y) {
    return {
        x: v.x * x,
        y: v.y * (y || x)
    };
}

/**
 * Copy a vector.
 *
 * @param {object} v Vector to copy.
 *
 * @return {object} Copy of the vector.
 */
function copy (v) {
    return {
        x: v.x,
        y: v.y
    };
}

function interpolate (p, n, interpolation) {
    interpolation = Math.max(0, Math.min(1, interpolation));

    return p + interpolation * (n - p);
}

function lerp (a, b, interpolation) {
    return {
        x: interpolate(a.x, b.x, interpolation),
        y: interpolate(a.y, b.y, interpolation)
    };
}

module.exports = {
    add,
    sub,
    scale,
    copy,
    lerp
};
