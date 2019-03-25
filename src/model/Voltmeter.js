import Device from "./Device";
export default class Voltmeter extends Device {
  constructor() {
    super();
    this.type = "V";
    this.resistance = 10000000;
  }
}
