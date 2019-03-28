import "./style/index.css";
import Board from "./Board";
import Circuit from "./model/Circuit";
import Battery from "./model/Battery";
import Bulb from "./model/Bulb";
import ee from "./EventEmitter";

let ids = null;
let timeOutEvent = 0;
const circuit = new Circuit();
global.circuit = circuit;

init();

var board = new Board();
board.build();

function addDevice(klass, score, x, y) {
  klass = klass.toLowerCase()[0];
  console.log("recognize", klass, score);

  ids[klass + "Id"]++;
  const temp = $(domStrs[klass + "DomStr"]).appendTo($(".container"));
  temp.css("top", y + "px");
  temp.css("left", x + "px");
  temp.attr("id", klass + ids[klass + "Id"]);
  temp.dblclick(e => {
    const id = $(e.target).attr("id");
    jsPlumb.removeAllEndpoints(id);
    circuit.deleteDevice(id);
    $(e.target).remove();
  });
  const [a1, a2] = jsPlumbAddItem(klass + ids[klass + "Id"]);
  circuit.addDevice(klass, a1, a2, klass + ids[klass + "Id"]);
}

ee.addListener("recognize", addDevice);

$(".back").click(e => {
  board.clear();
});
$(".watch").click(e => {
  if ($(e.currentTarget).hasClass("active")) {
    $(".ammeter")
      .removeClass("value")
      .html("A");
    $(".voltmeter")
      .removeClass("value")
      .html("V");
    $(e.currentTarget).removeClass("active");
    $(".watch i").html("&#xe78f;");
  } else {
    const values = circuit.showValues();
    values.forEach(el => {
      const k = Object.keys(el)[0];
      $(`[id*=${k}]`).html(el[k]);
      $(`[id*=${k}]`).addClass("value");
    });
    $(e.currentTarget).addClass("active");
    $(".watch i").html("&#xe8ff;");
  }
});

$(".delete").click(e => {
  board.clear();
  circuit.clear();
  jsPlumb.reset(false);
  init();
  $(".component").remove();
});

const domStrs = {
  aDomStr: '<div class="ammeter meter component">A</div>',
  vDomStr: '<div class="voltmeter meter component">V</div>',
  rDomStr: '<div class="resistance component"></div>',
  // switchDomStr: '<div class="switch component"></div>',
  bDomStr: '<div class="light component"></div>',
  pDomStr: '<div class="power component"></div>'
};
function init() {
  ids = {
    aId: 0,
    vId: 0,
    rId: 0,
    bId: 0,
    pId: 0
  };
  timeOutEvent = 0;
  jsPlumb.bind("dblclick", function(conn, originalEvent) {
    jsPlumb.deleteConnection(conn);
    circuit.deleteEdge(conn.id);
  });
  jsPlumb.bind("connectionDetached", function(connInfo, originalEvent) {
    circuit.deleteEdge(connInfo.connection.id);
  });
  // add edge
  jsPlumb.bind("connection", function(connInfo, originalEvent) {
    if (connInfo.connection.sourceId == connInfo.connection.targetId) {
      jsPlumb.detach(connInfo);
      alert("不能连接自己！");
    } else {
      console.log(
        "连接 " +
          connInfo.connection.sourceId +
          " - " +
          connInfo.connection.targetId
      );
      const endpoints = connInfo.connection.endpoints;
      circuit.addEdge(
        endpoints[0].anchor.id,
        endpoints[1].anchor.id,
        connInfo.connection.id
      );
    }
  });
}
jsPlumb.importDefaults({
  Connector: ["Bezier", { curviness: 150 }],
  PaintStyle: {
    strokeWidth: 5,
    stroke: "lightblue",
    // outlineStroke: "black",
    outlineWidth: 1
  },
  Connector: ["Bezier", { curviness: 30 }],
  Endpoint: ["Dot", { radius: 6 }]
  // EndpointStyle: { fill: "#999" } //端点的css样式声明
});

const common = {
  isSource: true,
  isTarget: true,
  maxConnections: -1
};

function jsPlumbAddItem(el) {
  const a1 = jsPlumb.addEndpoint(
    el,
    {
      anchors: ["Left"]
    },
    common
  ).anchor.id;
  const a2 = jsPlumb.addEndpoint(
    el,
    {
      anchors: ["Right"]
    },
    common
  ).anchor.id;

  jsPlumb.draggable(el, {
    containment: "draw-container"
  });

  return [a1, a2];
}
