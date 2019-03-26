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
        case "p":
          return new Battery();
        case "b":
          return new Bulb();
        case "r":
          return new Resistor();
        case "a":
          return new Ammeter();
        case "v":
          return new Voltmeter();
      }
    }
  }
}
