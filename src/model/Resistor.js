import Device from "./Device";
export default class Resistor extends Device {
  constructor() {
    super();
    this.type = "R";
    this.resistance = 5;
  }
}
