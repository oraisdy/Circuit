import "./style/index.css";
import Circuit from "./model/Circuit";
import Battery from "./model/Battery";
import Bulb from "./model/Bulb";
var circuit = new Circuit();
global.circuit = circuit;

const domStrs = {
  ammeterDomStr: '<div class="ammeter meter">A</div>',
  voltmeterDomStr: '<div class="voltmeter meter">V</div>',
  resistanceDomStr: '<div class="resistance"></div>',
  switchDomStr: '<div class="switch"></div>',
  lightDomStr: '<div class="light"></div>',
  powerDomStr: '<div class="power"></div>'
};
const ids = {
  ammeterId: 0,
  voltmeterId: 0,
  resistanceId: 0,
  switchId: 0,
  lightId: 0,
  powerId: 0
};

$(".to-choose").click(e => {
  const classes = [
    "ammeter",
    "voltmeter",
    "resistance",
    "switch",
    "light",
    "power"
  ];
  for (let klass of classes) {
    if ($(e.target).hasClass(klass)) {
      ids[klass + "Id"]++;
      var temp = $(domStrs[klass + "DomStr"]).appendTo($("#draw-container"));
      temp.attr("id", klass + ids[klass + "Id"]);
      const [a1, a2] = jsPlumbAddItem(klass + ids[klass + "Id"]);
      if (
        klass === "ammeter" ||
        klass === "voltmeter" ||
        klass === "resistance" ||
        klass === "power"
      ) {
        circuit.addDevice(klass[0], a1, a2);
      } else if (klass === "light") {
        circuit.addDevice("b", a1, a2);
      }
    }
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
  // console.log(connInfo, originalEvent);
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
    circuit.addEdge(endpoints[0].anchor.id, endpoints[1].anchor.id);
  }
});

var common = {
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
