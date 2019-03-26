import DeviceFactory from "./DeviceFactory";
import { AinTwoPoints, VinTwoPoints } from "./CircuitHelper";
export default class Circuit {
  constructor() {
    this.devices = [];
    this.edges = [];
    this.V = 10;
    this.arr = [];
    this.rel = [];
    // var arr = [
    //   ["", "a", "b", "c", "d", "e", "f", "g", "z"],
    //   ["a", 0, 1, 0, 0, 0, 1, 0, 0],
    //   ["b", 1, 0, 0, 0, 0, 1, 0, 0],
    //   ["c", 0, 0, 0, 1, 0, 0, 1, 0],
    //   ["d", 0, 0, 1, 0, 0, 0, 1, 0],
    //   ["e", 0, 0, 0, 0, 0, 0, 0, 1],
    //   ["f", 1, 1, 0, 0, 0, 0, 0, 0],
    //   ["g", 0, 0, 1, 1, 0, 0, 0, 0],
    //   ["z", 0, 0, 0, 0, 1, 0, 0, 0]
    // ];

    // // [端点1，端点2，元件代号，电阻值]
    // var rel = [["f", "g", "R", 4], ["d", "e", "R", 1], ["b", "c", "V", 10000000]];
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
      alert("没有电源，无法联通电路");
      return;
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
    console.log(JSON.stringify(arr));
    console.log(JSON.stringify(rel));
    // console.log("fg电流" + AinTwoPoints(arr, rel, 10, "f", "g"));
    // console.log("de电压", VinTwoPoints(arr, rel, V1, "d", "e"));
    // console.log("fg电压", VinTwoPoints(arr, rel, V1, "f", "g"));
  }
  getAinTwoPoints(p1, p2) {
    console.log(
      `${p1}-${p2}电流` + AinTwoPoints(this.arr, this.rel, this.V, p1, p2)
    );
  }
  getVinTwoPoints(p1, p2) {
    console.log(
      `${p1}-${p2}电压` + VinTwoPoints(this.arr, this.rel, this.V, p1, p2)
    );
  }
  // 加一个元件，a1 a2是左右两个锚点的id
  addDevice(type, a1, a2) {
    console.log("addDevice", type, a1, a2);
    const device = DeviceFactory.getInstance(type);
    device.anchor1 = a1;
    device.anchor2 = a2;
    device && this.devices.push(device);
    return this;
  }
  addEdge(a1, a2) {
    console.log("addEdge", a1, a2);
    this.edges.push([a1, a2]);
    return this;
  }
}
