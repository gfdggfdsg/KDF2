import Phaser from "phaser";
import GameState from "../engine/state/GameState";
import { axialToPixel } from "../engine/hex/HexGrid";

export default class UnitRenderer {
  private g: Phaser.GameObjects.Graphics;
  constructor(private scene: Phaser.Scene, private state: GameState) {
    this.g = scene.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 0.9 } });
    this.g.setDepth(10);
  }

  render() {
    this.g.clear();
    for (const u of this.state.units) {
      const p = axialToPixel(u.pos, this.state.hexSize);
      const radius = this.state.hexSize * 0.35;
      const fill = u.owner === 1 ? 0xffffff : 0xff5555;
      this.g.fillStyle(fill, 0.95).fillCircle(p.x, p.y, radius);
      this.g.lineStyle(2, 0x000000, 0.8).strokeCircle(p.x, p.y, radius);
    }
  }
}
