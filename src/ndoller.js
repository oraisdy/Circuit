/**
 * The $N Multistroke Recognizer (JavaScript version)
 *
 *	Lisa Anthony, Ph.D.
 *  UMBC
 *  Information Systems Department
 *  1000 Hilltop Circle
 *  Baltimore, MD 21250
 *  lanthony@umbc.edu
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 * The academic publications for the $N recognizer, and what should be
 * used to cite it, are:
 *
 *	Anthony, L. and Wobbrock, J.O. (2010). A lightweight multistroke
 *	  recognizer for user interface prototypes. Proceedings of Graphics
 *	  Interface (GI '10). Ottawa, Ontario (May 31-June 2, 2010). Toronto,
 *	  Ontario: Canadian Information Processing Society, pp. 245-252.
 *
 *	Anthony, L. and Wobbrock, J.O. (2012). $N-Protractor: A fast and
 *	  accurate multistroke recognizer. Proceedings of Graphics Interface
 *	  (GI '12). Toronto, Ontario (May 28-30, 2012). Toronto, Ontario:
 *	  Canadian Information Processing Society, pp. 117-120.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock and Lisa Anthony:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2011, Jacob O. Wobbrock and Lisa Anthony.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of UMBC nor the University of Washington,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Lisa Anthony OR Jacob O. Wobbrock
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 **/
//
// Point class
//
export function Point(x, y) {
  // constructor
  this.X = x;
  this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) {
  // constructor
  this.X = x;
  this.Y = y;
  this.Width = width;
  this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, useBoundedRotationInvariance, points) {
  // constructor
  this.Name = name;
  this.Points = Resample(points, NumPoints);
  var radians = IndicativeAngle(this.Points);
  this.Points = RotateBy(this.Points, -radians);
  this.Points = ScaleDimTo(this.Points, SquareSize, OneDThreshold);
  if (useBoundedRotationInvariance)
    this.Points = RotateBy(this.Points, +radians); // restore
  this.Points = TranslateTo(this.Points, Origin);
  this.StartUnitVector = CalcStartUnitVector(this.Points, StartAngleIndex);
  this.Vector = Vectorize(this.Points, useBoundedRotationInvariance); // for Protractor
}
//
// Multistroke class: a container for unistrokes
//
function Multistroke(name, useBoundedRotationInvariance, strokes) {
  // constructor
  this.Name = name;
  this.NumStrokes = strokes.length; // number of individual strokes

  var order = new Array(strokes.length); // array of integer indices
  for (var i = 0; i < strokes.length; i++) order[i] = i; // initialize
  var orders = new Array(); // array of integer arrays
  HeapPermute(strokes.length, order, /*out*/ orders);

  var unistrokes = MakeUnistrokes(strokes, orders); // returns array of point arrays
  this.Unistrokes = new Array(unistrokes.length); // unistrokes for this multistroke
  for (var j = 0; j < unistrokes.length; j++)
    this.Unistrokes[j] = new Unistroke(
      name,
      useBoundedRotationInvariance,
      unistrokes[j]
    );
}
//
// Result class
//
function Result(name, score, ms) {
  // constructor
  this.Name = name;
  this.Score = score;
  this.Time = ms;
}
//
// NDollarRecognizer constants
//
const NumMultistrokes = 0;
const NumPoints = 96;
const SquareSize = 250.0;
const OneDThreshold = 0.25; // customize to desired gesture set (usually 0.20 - 0.35)
const Origin = new Point(0, 0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
const StartAngleIndex = NumPoints / 8; // eighth of gesture length
const AngleSimilarityThreshold = Deg2Rad(30.0);
//
// NDollarRecognizer class
//
export function NDollarRecognizer(useBoundedRotationInvariance) {
  // constructor
  //
  // one predefined multistroke for each multistroke type
  //
  this.Multistrokes = new Array(NumMultistrokes);

  //
  // The $N Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
  //
  this.Recognize = function(
    strokes,
    useBoundedRotationInvariance,
    requireSameNoOfStrokes,
    useProtractor
  ) {
    var t0 = Date.now();
    var points = CombineStrokes(strokes); // make one connected unistroke from the given strokes
    points = Resample(points, NumPoints);
    var radians = IndicativeAngle(points);
    points = RotateBy(points, -radians);
    points = ScaleDimTo(points, SquareSize, OneDThreshold);
    if (useBoundedRotationInvariance) points = RotateBy(points, +radians); // restore
    points = TranslateTo(points, Origin);
    var startv = CalcStartUnitVector(points, StartAngleIndex);
    var vector = Vectorize(points, useBoundedRotationInvariance); // for Protractor

    var b = +Infinity;
    var u = -1;
    for (
      var i = 0;
      i < this.Multistrokes.length;
      i++ // for each multistroke
    ) {
      if (
        !requireSameNoOfStrokes ||
        strokes.length == this.Multistrokes[i].NumStrokes
      ) {
        // optional -- only attempt match when same # of component strokes
        for (
          var j = 0;
          j < this.Multistrokes[i].Unistrokes.length;
          j++ // each unistroke within this multistroke
        ) {
          if (
            AngleBetweenUnitVectors(
              startv,
              this.Multistrokes[i].Unistrokes[j].StartUnitVector
            ) <= AngleSimilarityThreshold
          ) {
            // strokes start in the same direction
            var d;
            if (useProtractor)
              // for Protractor
              d = OptimalCosineDistance(
                this.Multistrokes[i].Unistrokes[j].Vector,
                vector
              );
            // Golden Section Search (original $N)
            else
              d = DistanceAtBestAngle(
                points,
                this.Multistrokes[i].Unistrokes[j],
                -AngleRange,
                +AngleRange,
                AnglePrecision
              );
            if (d < b) {
              b = d; // best (least) distance
              u = i; // multistroke owner of unistroke
            }
          }
        }
      }
    }
    var t1 = Date.now();
    return u == -1
      ? new Result("No match.", 0.0, t1 - t0)
      : new Result(
          this.Multistrokes[u].Name,
          useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal,
          t1 - t0
        );
  };
  this.AddGesture = function(name, useBoundedRotationInvariance, strokes) {
    this.Multistrokes[this.Multistrokes.length] = new Multistroke(
      name,
      useBoundedRotationInvariance,
      strokes
    );
    // var num = 0;
    // for (var i = 0; i < this.Multistrokes.length; i++) {
    //   if (this.Multistrokes[i].Name == name) num++;
    // }
    // return num;
  };
  this.DeleteUserGestures = function() {
    this.Multistrokes.length = NumMultistrokes; // clear any beyond the original set
    return NumMultistrokes;
  };
}
//
// Private helper functions from here on down
//
function HeapPermute(n, order, /*out*/ orders) {
  if (n == 1) {
    orders[orders.length] = order.slice(); // append copy
  } else {
    for (var i = 0; i < n; i++) {
      HeapPermute(n - 1, order, orders);
      if (n % 2 == 1) {
        // swap 0, n-1
        var tmp = order[0];
        order[0] = order[n - 1];
        order[n - 1] = tmp;
      } else {
        // swap i, n-1
        var tmp = order[i];
        order[i] = order[n - 1];
        order[n - 1] = tmp;
      }
    }
  }
}
function MakeUnistrokes(strokes, orders) {
  var unistrokes = new Array(); // array of point arrays
  for (var r = 0; r < orders.length; r++) {
    for (
      var b = 0;
      b < Math.pow(2, orders[r].length);
      b++ // use b's bits for directions
    ) {
      var unistroke = new Array(); // array of points
      for (var i = 0; i < orders[r].length; i++) {
        var pts;
        if (((b >> i) & 1) == 1)
          // is b's bit at index i on?
          pts = strokes[orders[r][i]].slice().reverse();
        // copy and reverse
        else pts = strokes[orders[r][i]].slice(); // copy
        for (var p = 0; p < pts.length; p++)
          unistroke[unistroke.length] = pts[p]; // append points
      }
      unistrokes[unistrokes.length] = unistroke; // add one unistroke to set
    }
  }
  return unistrokes;
}
function CombineStrokes(strokes) {
  var points = new Array();
  for (var s = 0; s < strokes.length; s++) {
    for (var p = 0; p < strokes[s].length; p++)
      points[points.length] = new Point(strokes[s][p].X, strokes[s][p].Y);
  }
  return points;
}
function Resample(points, n) {
  var I = PathLength(points) / (n - 1); // interval length
  var D = 0.0;
  var newpoints = new Array(points[0]);
  for (var i = 1; i < points.length; i++) {
    var d = Distance(points[i - 1], points[i]);
    if (D + d >= I) {
      var qx =
        points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
      var qy =
        points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
      var q = new Point(qx, qy);
      newpoints[newpoints.length] = q; // append new point 'q'
      points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
      D = 0.0;
    } else D += d;
  }
  if (newpoints.length == n - 1)
    // somtimes we fall a rounding-error short of adding the last point, so add it if so
    newpoints[newpoints.length] = new Point(
      points[points.length - 1].X,
      points[points.length - 1].Y
    );
  return newpoints;
}
function IndicativeAngle(points) {
  var c = Centroid(points);
  return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) {
  // rotates points around centroid
  var c = Centroid(points);
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X;
    var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function ScaleDimTo(points, size, ratio1D) {
  // scales bbox uniformly for 1D, non-uniformly for 2D
  var B = BoundingBox(points);
  var uniformly = Math.min(B.Width / B.Height, B.Height / B.Width) <= ratio1D; // 1D or 2D gesture test
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = uniformly
      ? points[i].X * (size / Math.max(B.Width, B.Height))
      : points[i].X * (size / B.Width);
    var qy = uniformly
      ? points[i].Y * (size / Math.max(B.Width, B.Height))
      : points[i].Y * (size / B.Height);
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function TranslateTo(points, pt) {
  // translates points' centroid
  var c = Centroid(points);
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].X + pt.X - c.X;
    var qy = points[i].Y + pt.Y - c.Y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function Vectorize(points, useBoundedRotationInvariance) {
  // for Protractor
  var cos = 1.0;
  var sin = 0.0;
  if (useBoundedRotationInvariance) {
    var iAngle = Math.atan2(points[0].Y, points[0].X);
    var baseOrientation =
      (Math.PI / 4.0) * Math.floor((iAngle + Math.PI / 8.0) / (Math.PI / 4.0));
    cos = Math.cos(baseOrientation - iAngle);
    sin = Math.sin(baseOrientation - iAngle);
  }
  var sum = 0.0;
  var vector = new Array();
  for (var i = 0; i < points.length; i++) {
    var newX = points[i].X * cos - points[i].Y * sin;
    var newY = points[i].Y * cos + points[i].X * sin;
    vector[vector.length] = newX;
    vector[vector.length] = newY;
    sum += newX * newX + newY * newY;
  }
  var magnitude = Math.sqrt(sum);
  for (var i = 0; i < vector.length; i++) vector[i] /= magnitude;
  return vector;
}
function OptimalCosineDistance(v1, v2) {
  // for Protractor
  var a = 0.0;
  var b = 0.0;
  for (var i = 0; i < v1.length; i += 2) {
    a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
    b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
  }
  var angle = Math.atan(b / a);
  return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold) {
  var x1 = Phi * a + (1.0 - Phi) * b;
  var f1 = DistanceAtAngle(points, T, x1);
  var x2 = (1.0 - Phi) * a + Phi * b;
  var f2 = DistanceAtAngle(points, T, x2);
  while (Math.abs(b - a) > threshold) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = Phi * a + (1.0 - Phi) * b;
      f1 = DistanceAtAngle(points, T, x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = (1.0 - Phi) * a + Phi * b;
      f2 = DistanceAtAngle(points, T, x2);
    }
  }
  return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians) {
  var newpoints = RotateBy(points, radians);
  return PathDistance(newpoints, T.Points);
}
function Centroid(points) {
  var x = 0.0,
    y = 0.0;
  for (var i = 0; i < points.length; i++) {
    x += points[i].X;
    y += points[i].Y;
  }
  x /= points.length;
  y /= points.length;
  return new Point(x, y);
}
function BoundingBox(points) {
  var minX = +Infinity,
    maxX = -Infinity,
    minY = +Infinity,
    maxY = -Infinity;
  for (var i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].X);
    minY = Math.min(minY, points[i].Y);
    maxX = Math.max(maxX, points[i].X);
    maxY = Math.max(maxY, points[i].Y);
  }
  return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2) {
  // average distance between corresponding points in two paths
  var d = 0.0;
  for (
    var i = 0;
    i < pts1.length;
    i++ // assumes pts1.length == pts2.length
  )
    d += Distance(pts1[i], pts2[i]);
  return d / pts1.length;
}
function PathLength(points) {
  // length traversed by a point path
  var d = 0.0;
  for (var i = 1; i < points.length; i++)
    d += Distance(points[i - 1], points[i]);
  return d;
}
function Distance(p1, p2) {
  // distance between two points
  var dx = p2.X - p1.X;
  var dy = p2.Y - p1.Y;
  return Math.sqrt(dx * dx + dy * dy);
}
function CalcStartUnitVector(points, index) {
  // start angle from points[0] to points[index] normalized as a unit vector
  var v = new Point(
    points[index].X - points[0].X,
    points[index].Y - points[0].Y
  );
  var len = Math.sqrt(v.X * v.X + v.Y * v.Y);
  return new Point(v.X / len, v.Y / len);
}
function AngleBetweenUnitVectors(v1, v2) {
  // gives acute angle between unit vectors from (0,0) to v1, and (0,0) to v2
  var n = v1.X * v2.X + v1.Y * v2.Y;
  var c = Math.max(-1.0, Math.min(1.0, n)); // ensure [-1,+1]
  return Math.acos(c); // arc cosine of the vector dot product
}
function Deg2Rad(d) {
  return (d * Math.PI) / 180.0;
}
