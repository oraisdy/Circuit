import Battery from "./Battery";
import Bulb from "./Bulb";
import Resistor from "./Resistor";
import Ammeter from "./Ammeter";
import Voltmeter from "./Voltmeter";

export default class DeviceFactory {
  constructor() {}
  static getInstance(type) {
    if (type.toLowerCase) {
      switch (type.toLowerCase()) {
        case "Bt":
          return new Battery();
        case "B":
          return new Bulb();
        case "R":
          return new Resistor();
        case "A":
          return new Ammeter();
        case "V":
          return new Voltmeter();
      }
    }
  }
}
