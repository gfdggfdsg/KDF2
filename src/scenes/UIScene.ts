import Phaser from "phaser";
import { events } from "../services/EventBus";

export default class UIScene extends Phaser.Scene {
  private info!: Phaser.GameObjects.Text;

  constructor() { super("UIScene"); }

  create() {
    this.info = this.add.text(10, 10,
      "LMB: bewegen (innerhalb Reichweite)\nR: Runde beenden",
      { fontFamily: "monospace", fontSize: "14px", color: "#ffffff" }
    ).setDepth(1000);

    events.on("ui:status", (txt: string) => { this.info.setText(txt); });
  }
}
