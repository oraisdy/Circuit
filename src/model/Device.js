export default class Device {
  constructor() {
    this.anchor1 = null;
    this.anchor2 = null;
    this.type = null;
    this.resistance = 0;
  }
  toRel() {
    return [this.anchor1, this.anchor2, this.type, this.resistance];
  }
}
