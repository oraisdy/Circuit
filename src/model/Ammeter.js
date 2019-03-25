import Device from "./Device";
export default class Ammeter extends Device {
  constructor() {
    super();
    this.type = "A";
    this.resistance = 0;
  }
}
