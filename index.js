"use strict";

var handle = void 0;

var circuit = function circuit() {
  if (handle) clearInterval(handle);

  var starPoints = 10;
  var resolution = 800;
  var padding = 10;

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");

  var drawDots = false;

  canvas.width = canvas.height = resolution + padding * 2;

  var points = [];
  var lines = [];
  var lineset = {};
  var pointset = {};

  var stringify = function stringify(obj) {
    return JSON.stringify(obj, function(key, val) {
      return val !== null && val !== undefined && val.toFixed
        ? +val.toFixed(1)
        : val;
    });
  };

  var eps = 0.0000001;
  function between(a, b, c) {
    return a - eps <= b && b <= c + eps;
  }
  function segment_intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    var x =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
      return false;
    } else {
      if (x1 >= x2) {
        if (!between(x2, x, x1)) {
          return false;
        }
      } else {
        if (!between(x1, x, x2)) {
          return false;
        }
      }
      if (y1 >= y2) {
        if (!between(y2, y, y1)) {
          return false;
        }
      } else {
        if (!between(y1, y, y2)) {
          return false;
        }
      }
      if (x3 >= x4) {
        if (!between(x4, x, x3)) {
          return false;
        }
      } else {
        if (!between(x3, x, x4)) {
          return false;
        }
      }
      if (y3 >= y4) {
        if (!between(y4, y, y3)) {
          return false;
        }
      } else {
        if (!between(y3, y, y4)) {
          return false;
        }
      }
    }
    return [x, y];
  }

  for (var i = 0; i < starPoints; i++) {
    var rad = (i / starPoints) * Math.PI * 2;
    var x = padding + resolution / 2 + (Math.sin(rad) * resolution) / 2;
    var y = padding + resolution / 2 + (Math.cos(rad) * resolution) / 2;

    if (i > 0) {
      var _line = [
        x,
        y,
        points[points.length - 1][0],
        points[points.length - 1][1]
      ];
      lines.push(_line);
      lineset[stringify(_line)] = true;
    }
    points.push([x, y]);
    pointset[stringify([x, y])] = true;
  }
  var line = [
    points[0][0],
    points[0][1],
    points[points.length - 1][0],
    points[points.length - 1][1]
  ];
  lines.push(line);
  lineset[stringify(line)] = true;

  var rndPoint = function rndPoint() {
    return points[Math.floor(Math.random() * points.length)];
  };

  var iteration = function iteration() {
    var p1 = void 0,
      p2 = void 0,
      line = void 0;
    do {
      do {
        p1 = rndPoint();
        p2 = rndPoint();
      } while (p1 === p2);
      line = [p1[0], p1[1], p2[0], p2[1]];
    } while (lineset[stringify(line)]);
    lines.push(line);

    for (var _i = 0; _i < lines.length; _i++) {
      var intersection = segment_intersection(
        line[0],
        line[1],
        line[2],
        line[3],
        lines[_i][0],
        lines[_i][1],
        lines[_i][2],
        lines[_i][3]
      );
      if (
        intersection &&
        !pointset[stringify(intersection)] &&
        intersection[0] > padding &&
        intersection[1] > padding &&
        intersection[0] < resolution - padding &&
        intersection[1] < resolution - padding
      ) {
        points.push(intersection);
        pointset[stringify(intersection)] = true;
      }
    }

    lineset[stringify(line)] = true;

    ctx.clearRect(0, 0, resolution + padding * 2, resolution + padding * 2);
    if (drawDots) {
      for (var _i2 = 0; _i2 < points.length; _i2++) {
        ctx.beginPath();
        ctx.arc(points[_i2][0], points[_i2][1], 2, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    }

    for (var _i3 = 0; _i3 < lines.length; _i3++) {
      ctx.beginPath();
      ctx.moveTo(lines[_i3][0], lines[_i3][1]);
      ctx.lineTo(lines[_i3][2], lines[_i3][3]);
      ctx.stroke();
    }
  };

  handle = setInterval(iteration, 10);
};

circuit();
setInterval(circuit, 5000);
