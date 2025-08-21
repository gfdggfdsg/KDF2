import Phaser from "phaser";
import GameState from "../engine/state/GameState";
import type { Terrain } from "../engine/types";
import { axialToPixel } from "../engine/hex/HexGrid";

export default class MapRenderer {
  private g: Phaser.GameObjects.Graphics;
  constructor(private scene: Phaser.Scene, private state: GameState) {
    this.g = scene.add.graphics();
  }

  private colorFor(t: Terrain): number {
    switch (t) {
      case "forest": return 0x2e8b57;
      case "hill":   return 0x8b7355;
      case "water":  return 0x3a6ea5;
      default:       return 0x2d333b;
    }
  }

  private drawHex(cx: number, cy: number, size: number, stroke = 0x444444, fill?: number, alpha = 0.45) {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI / 180) * (60 * i - 30);
      pts.push({ x: cx + size * Math.cos(ang), y: cy + size * Math.sin(ang) });
    }
    this.g.lineStyle(1, stroke, 1).beginPath();
    this.g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) this.g.lineTo(pts[i].x, pts[i].y);
    this.g.closePath().strokePath();
    if (fill !== undefined) this.g.fillStyle(fill, alpha).fillPoints(pts, true);
  }

  render() {
    const { width, height, hexSize } = this.state;
    this.g.clear();
    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const p = axialToPixel({ q, r }, hexSize);
        const t = this.state.terrainAt(q, r);
        this.drawHex(p.x, p.y, hexSize, 0x444444, this.colorFor(t), 0.5);
      }
    }
  }
}
