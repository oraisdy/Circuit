import "./style/index.css";
import Circuit from "./model/Circuit";
import Battery from "./model/Battery";
import Bulb from "./model/Bulb";
var circuit = new Circuit();

const ammeterDomStr = '<div class="ammeter meter">A</div>';
const voltmeterDomStr = '<div class="voltmeter meter">V</div>';
const resistanceDomStr = '<div class="resistance"></div>';
const switchDomStr = '<div class="switch"></div>';
const lightDomStr = '<div class="light"></div>';

var ammeterId = 0,
  voltmeterId = 0,
  resistanceId = 0,
  switchId = 0,
  lightId = 0;

// add device
$(".to-choose").click(e => {
  if ($(e.target).hasClass("ammeter")) {
    ammeterId++;
    var temp = $(ammeterDomStr).appendTo($("#draw-container"));
    temp.attr("id", "ammeter" + ammeterId);
    jsPlumbAddItem("ammeter" + ammeterId);
  } else if ($(e.target).hasClass("voltmeter")) {
    voltmeterId++;
    temp = $(voltmeterDomStr).appendTo($("#draw-container"));
    temp.attr("id", "voltmeter" + voltmeterId);
    jsPlumbAddItem("voltmeter" + voltmeterId);
  } else if ($(e.target).hasClass("resistance")) {
    resistanceId++;
    temp = $(resistanceDomStr).appendTo($("#draw-container"));
    temp.attr("id", "resistance" + resistanceId);
    jsPlumbAddItem("resistance" + resistanceId);
  } else if ($(e.target).hasClass("switch")) {
    switchId++;
    temp = $(switchDomStr).appendTo($("#draw-container"));
    temp.attr("id", "switch" + switchId);
    jsPlumbAddItem("switch" + switchId);
  } else if ($(e.target).hasClass("light")) {
    lightId++;
    temp = $(lightDomStr).appendTo($("#draw-container"));
    temp.attr("id", "light" + switchId);
    jsPlumbAddItem("light" + switchId);
  }
});

jsPlumb.importDefaults({
  Connector: ["Bezier", { curviness: 150 }],
  PaintStyle: {
    strokeWidth: 6,
    stroke: "#666",
    outlineStroke: "black",
    outlineWidth: 1
  },
  Connector: ["Bezier", { curviness: 30 }],
  Endpoint: ["Dot", { radius: 5 }],
  EndpointStyle: { fill: "#999" } //端点的css样式声明
});

jsPlumb.bind("dblclick", function(conn, originalEvent) {
  jsPlumb.deleteConnection(conn);
});

// add edge
jsPlumb.bind("connection", function(connInfo, originalEvent) {
  console.log(connInfo, originalEvent);
  if (connInfo.connection.sourceId == connInfo.connection.targetId) {
    jsPlumb.detach(connInfo);
    alert("不能连接自己！");
  } else {
    console.log(
      "连接" +
        connInfo.connection.sourceId +
        "===" +
        connInfo.connection.targetId
    );
  }
});

var common = {
  isSource: true,
  isTarget: true,
  maxConnections: -1
};

function jsPlumbAddItem(el) {
  jsPlumb.addEndpoint(
    el,
    {
      anchors: ["Right"]
    },
    common
  );

  jsPlumb.addEndpoint(
    el,
    {
      anchors: ["Left"]
    },
    common
  );

  // jsPlumb.addEndpoint(
  //   el,
  //   {
  //     anchors: ["Top"]
  //   },
  //   common
  // );

  // jsPlumb.addEndpoint(
  //   el,
  //   {
  //     anchors: ["Bottom"]
  //   },
  //   common
  // );

  jsPlumb.draggable(el, {
    containment: "draw-container"
  });
}
