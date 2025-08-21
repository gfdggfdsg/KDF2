import Phaser from "phaser";
import GameState from "../engine/state/GameState";
import type { Hex } from "../engine/types";
import { pixelToAxial, inBounds, hexDist, axialToPixel } from "../engine/hex/HexGrid";
import UnitRenderer from "../rendering/UnitRenderer";
import { events } from "../services/EventBus";

export default class InputController {
  private hover: Hex | null = null;
  private highlight: Phaser.GameObjects.Graphics;
  private readonly AP = 4;

  constructor(
    private scene: Phaser.Scene,
    private state: GameState,
    private units: UnitRenderer,
    private selectedId: string
  ) {
    this.highlight = scene.add.graphics({});
    this.highlight.setDepth(5);

    scene.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      const h = pixelToAxial(p.x, p.y, this.state.hexSize);
      this.hover = inBounds(h, this.state.width, this.state.height) ? h : null;
      this.drawHighlight();
    });

    scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      const h = pixelToAxial(p.x, p.y, this.state.hexSize);
      if (!inBounds(h, this.state.width, this.state.height)) return;
      const u = this.state.units.find(u => u.id === this.selectedId);
      if (!u) return;
      if (hexDist(u.pos, h) <= this.AP) {
        this.state.moveUnit(u.id, h);
        this.units.render();
        this.drawHighlight();
        events.emit("ui:status", this.statusText());
      }
    });

    scene.input.keyboard?.on("keydown-R", () => {
      events.emit("ui:status", "Runde beendet. (Demo)\nLMB: bewegen | R: Runde beenden");
    });

    this.drawHighlight();
    events.emit("ui:status", this.statusText());
  }

  private statusText(): string {
    const u = this.state.units.find(u => u.id === this.selectedId);
    return u
      ? `Einheit ${u.id} (${u.type}) @ q${u.pos.q}, r${u.pos.r}\nLMB: bewegen (<= ${this.AP}) | R: Runde beenden`
      : "Keine Einheit ausgewählt.";
  }

  private drawHex(cx: number, cy: number, size: number, fill: number, alpha: number, stroke = 0x00ff00) {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI / 180) * (60 * i - 30);
      pts.push({ x: cx + size * Math.cos(ang), y: cy + size * Math.sin(ang) });
    }
    this.highlight.lineStyle(1, stroke, 1).beginPath();
    this.highlight.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) this.highlight.lineTo(pts[i].x, pts[i].y);
    this.highlight.closePath().strokePath();
    this.highlight.fillStyle(fill, alpha).fillPoints(pts, true);
  }

  private drawHighlight() {
    this.highlight.clear();
    const u = this.state.units.find(u => u.id === this.selectedId);
    if (!u) return;

    for (let r = 0; r < this.state.height; r++) {
      for (let q = 0; q < this.state.width; q++) {
        const h = { q, r };
        if (hexDist(u.pos, h) <= this.AP) {
          const p = axialToPixel(h, this.state.hexSize);
          this.drawHex(p.x, p.y, this.state.hexSize - 3, 0x00ff00, 0.18);
        }
      }
    }

    if (this.hover) {
      const p = axialToPixel(this.hover, this.state.hexSize);
      this.drawHex(p.x, p.y, this.state.hexSize - 2, 0xffffff, 0.08, 0xffffff);
    }
  }
}
