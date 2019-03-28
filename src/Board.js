import { NDollarRecognizer, Point } from "./ndoller.js";
import gestures from "./gestures.json";
import ee from "./EventEmitter";

export default class Board {
  constructor() {
    this._r = new NDollarRecognizer(false);
    for (let key in gestures) {
      this._r.AddGesture(
        key,
        false,
        gestures[key].map(ps => ps.map(p => new Point(p["X"], p["Y"])))
      );
    }
    this._points = new Array();
    this._strokes = new Array(); // array of point arrays
    this._canvas = document.getElementById("myCanvas");
    this._g = this._canvas.getContext("2d");
    this._rc = getCanvasRect(this._canvas);

    function getCanvasRect(canvas) {
      var w = canvas.width;
      var h = canvas.height;

      var cx = canvas.offsetLeft;
      var cy = canvas.offsetTop;
      while (canvas.offsetParent != null) {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
      }
      return { x: cx, y: cy, width: w, height: h };
    }
  }
  build() {
    let { _points, _canvas, _rc, _g, _strokes } = this;
    _canvas.onmousedown = _canvas.ontouchstart = event =>
      mouseDownEvent(
        event.clientX || event.touches[0].clientX,
        event.clientY || event.touches[0].clientY,
        event.button
      );
    _canvas.onmousemove = _canvas.ontouchmove = event => {
      event.stopPropagation();
      event.preventDefault();
      mouseMoveEvent(
        event.clientX || event.touches[0].clientX,
        event.clientY || event.touches[0].clientY,
        event.button
      );
    };

    _canvas.onmouseup = _canvas.ontouchend = _canvas.ontouchcancel = event => {
      event.stopPropagation();
      event.preventDefault();
      mouseUpEvent(
        event.clientX || event.changedTouches[0].pageX,
        event.clientY || event.changedTouches[0].pageY,
        event.button
      );
    };
    _g.lineWidth = 2;
    _g.font = "16px Gentilis";
    _g.fillStyle = "lightblue";
    _g.fillRect(0, 0, _rc.width, 20);

    var _isDown = false;

    function getScrollX() {
      var scrollX = $(window).scrollLeft();
      return scrollX;
    }
    function getScrollY() {
      var scrollY = $(window).scrollTop();
      return scrollY;
    }

    //
    // Mouse Events
    //
    var mouseDownEvent = (x, y, button) => {
      document.onselectstart = function() {
        return false;
      }; // disable drag-select
      document.onmousedown = function() {
        return false;
      }; // disable drag-select
      // if (button <= 1) {
      _isDown = true;
      x -= _rc.x - getScrollX();
      y -= _rc.y - getScrollY();
      if (_points.length == 0) {
        _strokes.length = 0;
        _g.clearRect(0, 0, _rc.width, _rc.height);
      }
      _points.length = 1; // clear
      _points[0] = new Point(x, y);
      this.drawText("Recording stroke #" + (_strokes.length + 1) + "...");
      var clr =
        "rgb(" + rand(0, 200) + "," + rand(0, 200) + "," + rand(0, 200) + ")";
      _g.strokeStyle = clr;
      _g.fillStyle = clr;
      _g.fillRect(x - 4, y - 3, 9, 9);
      // } else if (button == 2) {
      //   this.drawText("Recognizing gesture...");
      // }
    };
    var mouseMoveEvent = (x, y, button) => {
      if (_isDown) {
        x -= _rc.x - getScrollX();
        y -= _rc.y - getScrollY();
        _points[_points.length] = new Point(x, y); // append
        drawConnectedPoint(_points.length - 2, _points.length - 1);
      }
    };
    var mouseUpEvent = (x, y, button) => {
      document.onselectstart = function() {
        return true;
      }; // enable drag-select
      document.onmousedown = document.ontouchmove = function() {
        return true;
      }; // enable drag-select
      // if (button <= 1) {
      if (_isDown) {
        _isDown = false;
        _strokes[_strokes.length] = _points.slice(); // add new copy to set
        this.drawText("Stroke #" + _strokes.length + " recorded.");
      }

      if (
        _strokes.length > 1 ||
        (_strokes.length == 1 && _strokes[0].length >= 10)
      ) {
        var result = this._r.Recognize(_strokes, false, false, false);
        // console.log(result.Name, "recognize score", result.Score);

        if (result.Score > 0.85) {
          this.drawText(
            "Result: " +
              result.Name +
              " (" +
              round(result.Score, 2) +
              ") in " +
              result.Time +
              " ms."
          );
          this.clear();
          ee.emitEvent("recognize", [result.Name, result.Score, x, y]);
        }
      } else {
        this.drawText("开始绘制元件");
      }
    };
    function drawConnectedPoint(from, to) {
      _g.beginPath();
      _g.moveTo(_points[from].X, _points[from].Y);
      _g.lineTo(_points[to].X, _points[to].Y);
      _g.closePath();
      _g.stroke();
    }

    function rand(low, high) {
      return Math.floor((high - low + 1) * Math.random()) + low;
    }
    function round(n, d) {
      // round 'n' to 'd' decimals
      d = Math.pow(10, d);
      return Math.round(n * d) / d;
    }
  }
  drawText(str) {
    this._g.fillStyle = "lightblue";
    this._g.fillRect(0, 0, this._rc.width, 20);
    this._g.fillStyle = "#000";
    this._g.fillText(str, 1, 14);
  }
  clear() {
    this._points.length = 0; // clear and signal to clear strokes on next mousedown
    this._g.clearRect(0, 0, this._rc.width, this._rc.height);
    this.drawText("Canvas cleared.");
  }
}
