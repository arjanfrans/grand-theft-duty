'use strict';

var v = require('./vector');

var LEFT = -1;
var MIDDLE = 0;
var RIGHT = 1;

function getRegion(line, point) {
  var l = v.len2(line);
  var dp = v.dot(point, line);


  if (dp < 0) {
    return LEFT;
  } else if (dp > l) {
    return RIGHT;
  } else {
    return MIDDLE;
  }
}

module.exports = {
  LEFT: LEFT,
  MIDDLE: MIDDLE,
  RIGHT: RIGHT,
  getRegion: getRegion
};