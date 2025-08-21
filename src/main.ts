import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import BattleScene from "./scenes/BattleScene";
import UIScene from "./scenes/UIScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0d0f12",
  width: 960,
  height: 640,
  scene: [BootScene, BattleScene, UIScene],
});
