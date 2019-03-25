import DeviceFactory from "./DeviceFactory";

export default class Circuit {
  constructor() {
    this.devices = [];
    this.edges = [];
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
  calculate() {
    const rel = this.devices.map(d => d.toRel());
    const anchors = ["a"]
      .concat(this.devices.map(d => d.a1))
      .concat(this.devices.map(d => d.a2))
      .concat(["z"]);
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
    console.log(arr);
    console.log(rel);
  }
  addDevice(type) {
    const device = DeviceFactory.getInstance(type);
    device && this.devices.push(device);
    return this;
  }
  removeDevice(device) {
    const index = this.devices.indexOf(device);
    if (index !== -1) {
      this.devices.splice(index, 1);
    }
    return this;
  }
  addEdge(a1, a2) {
    this.edges.push([a1, a2]);
    return this;
  }
}
