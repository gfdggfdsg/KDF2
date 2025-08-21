import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }

  preload() {
    this.load.json("units", "/data/units.json");
    this.load.json("map-skirmish", "/data/maps/skirmish_20x20.json");
  }

  create() {
    this.scene.start("BattleScene", { mapKey: "map-skirmish" });
    this.scene.launch("UIScene");
  }
}
