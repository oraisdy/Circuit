import DeviceFactory from "./DeviceFactory";
import { AinTwoPoints, VinTwoPoints } from "./CircuitHelper";
export default class Circuit {
  constructor() {
    this.devices = [];
    this.edges = [];
    this.V = 10;
    this.arr = [];
    this.rel = [];
  }
  clear() {
    this.devices = [];
    this.edges = [];
    this.V = 10;
    this.arr = [];
    this.rel = [];
  }
  connect() {
    const rel = this.devices
      .filter(d => d.type.toLowerCase() !== "bt")
      .map(d => d.toRel());
    const anchors = this.devices
      .map(d => d.anchor1)
      .concat(this.devices.map(d => d.anchor2));
    const arr = [];
    arr.push([""].concat(anchors));
    anchors.forEach(a => {
      arr.push([a].concat(Array(anchors.length).fill(0)));
    });
    for (let e of this.edges) {
      const i1 = anchors.indexOf(e[0]);
      const i2 = anchors.indexOf(e[1]);
      arr[i1 + 1][i2 + 1] = 1;
      arr[i2 + 1][i1 + 1] = 1;
    }
    let power = this.devices.filter(d => d.type.toLowerCase() === "bt");
    if (power.length === 0) {
      // alert("没有电源，无法联通电路");
      return false;
    }
    power = power[0];
    // console.log(power);
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === power.anchor1) arr[i][j] = "a";
        if (arr[i][j] === power.anchor2) arr[i][j] = "z";
      }
    }
    this.arr = arr;
    this.rel = rel;
    // console.log(JSON.stringify(arr));
    // console.log(JSON.stringify(rel));
    // console.log("fg电流" + AinTwoPoints(arr, rel, 10, "f", "g"));
    // console.log("de电压", VinTwoPoints(arr, rel, V1, "d", "e"));
    // console.log("fg电压", VinTwoPoints(arr, rel, V1, "f", "g"));
  }
  showValues() {
    const aValues = this.devices
      .filter(d => d.type.toLowerCase() === "a")
      .map(d => ({
        [d.id]: this.getAinTwoPoints(d.anchor1, d.anchor2) + " A"
      }));
    const vValues = this.devices
      .filter(d => d.type.toLowerCase() === "v")
      .map(d => ({
        [d.id]: this.getVinTwoPoints(d.anchor1, d.anchor2) + " V"
      }));
    return aValues.concat(vValues);
  }
  getAinTwoPoints(p1, p2) {
    console.log(
      `${p1}-${p2}电流` + AinTwoPoints(this.arr, this.rel, this.V, p1, p2)
    );
    return AinTwoPoints(this.arr, this.rel, this.V, p1, p2);
  }
  getVinTwoPoints(p1, p2) {
    console.log(
      `${p1}-${p2}电压` + VinTwoPoints(this.arr, this.rel, this.V, p1, p2)
    );
    return VinTwoPoints(this.arr, this.rel, this.V, p1, p2);
  }
  // 加一个元件，a1 a2是左右两个锚点的id
  addDevice(type, a1, a2, id) {
    const device = DeviceFactory.getInstance(type);
    device.anchor1 = a1;
    device.anchor2 = a2;
    device.id = id;
    device && this.devices.push(device);
    return this;
  }
  deleteDevice(id) {
    this.devices = this.devices.filter(d => d.id !== id);
  }
  addEdge(a1, a2, eid) {
    this.edges.push([a1, a2, eid]);
    this.connect();
    return this;
  }
  deleteEdge(eid) {
    this.edges = this.edges.filter(e => e[2] !== eid);
    this.connect();
  }
}
