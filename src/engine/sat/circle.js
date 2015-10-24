'use strict';

var v = require('./vector');
var square = require('./shapes').tlSquare;

function getAABB (c) {
  var corner = v.sub(c.position, {x: c.radius, y: c.radius});

  return square(corner, c.radius * 2);
}

module.exports = {
  getAABB: getAABB
};